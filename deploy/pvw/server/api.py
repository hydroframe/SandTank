import os, sys, shutil, types, inspect, traceback, logging, re, json, fnmatch, time

from wslink import register as exportRpc

import paraview
from paraview import simple, servermanager
from paraview.web import protocols as pv_protocols

from vtkmodules.vtkCommonCore import vtkUnsignedCharArray
from vtkmodules.vtkCommonDataModel import vtkImageData

# import Twisted reactor for later callback
from twisted.internet import reactor


if sys.version_info >= (2,7):
    buffer = memoryview
else:
    buffer = buffer

# =============================================================================
# SandTankEngine protocol
# =============================================================================

class SandTankEngine(pv_protocols.ParaViewWebProtocol):
    def __init__(self, simulationDirectory = '', **kwargs):
        super(SandTankEngine, self).__init__()
        self.runName = os.path.basename(simulationDirectory)
        self.workdir = simulationDirectory
        self.pfbReader = None
        self.lastProcessedTimestep = -1
        self.lastConfig = None
        self.templateName = 'template'
        self.domain = None

        simple.LoadDistributedPlugin('ParFlow')
        self.reset()

    # -------------------------------------------------------------------------

    @exportRpc("parflow.sandtank.reset")
    def reset(self):
        '''
        mkdir -p "/pvw/simulations/runs/$runId"
        cd "/pvw/simulations/runs/$runId"

        cp /pvw/simulations/template/* "/pvw/simulations/runs/$runId/"
        '''
        if os.path.exists(self.workdir):
            shutil.rmtree(self.workdir)

        tplPath = os.path.abspath(os.path.join(self.workdir, '../..', self.templateName))
        shutil.copytree(tplPath, self.workdir)
        self.lastProcessedTimestep = -1


    # -------------------------------------------------------------------------

    @exportRpc("parflow.sandtank.config.update")
    def updateConfiguration(self, config = None):
        if config:
            self.lastConfig = config
        filePath = os.path.abspath(os.path.join(self.workdir, 'config.tcl'))
        startNumber = self.getLastTimeStep()
        if self.lastProcessedTimestep > startNumber:
            self.lastProcessedTimestep = startNumber

        with open(filePath, 'w') as f:
            # Global
            f.write('# Global settings\n')
            f.write('set reset          %s\n' % self.lastConfig['runReset'])
            f.write('\n')
            f.write('set StartNumber    %s\n' % startNumber)
            f.write('set RunLength      %s\n' % self.lastConfig['runLength'])
            f.write('\n')
            f.write('set hleft          %s\n' % self.lastConfig['hLeft'])
            f.write('set hright         %s\n' % self.lastConfig['hRight'])
            f.write('\n')
            f.write('set lake           %s\n' % self.lastConfig['isLake'])

            # Porosity
            f.write('\n# Update Porosity\n')
            for key in self.lastConfig['k']:
                f.write('set k_%s       %s\n' % (key, self.lastConfig['k'][key]))

            # Wells
            f.write('\n# Update Wells\n')
            for key in self.lastConfig['wells']:
                value = self.lastConfig['wells'][key]
                action = 'Extraction'
                if value < 0:
                    action = 'Injection'
                    value *= -1.0
                f.write('set well_%s_action     %s\n' % (key, action))
                f.write('set well_%s_value      %s\n' % (key, value))


    # -------------------------------------------------------------------------

    def pushIndicator(self):
        filePath = os.path.join(self.workdir, 'SandTank_Indicator.pfb')
        if not os.path.exists(filePath):
            print('no file for indicator')
            return None

        if self.pfbReader:
            self.pfbReader.FileNames=[filePath]
        else:
            self.pfbReader = simple.PFBreader(FileNames=[filePath], IsCLMFile = 'No')
        self.pfbReader.UpdatePipeline()

        imageData = self.pfbReader.GetClientSideObject().GetOutput().GetBlock(0)
        imageSize = [v - 1 for v in imageData.GetDimensions()]
        array = imageData.GetCellData().GetArray(0)
        size = array.GetNumberOfTuples()

        indicatorDimensions = imageSize
        indicatorArray = vtkUnsignedCharArray()
        indicatorArray.SetNumberOfTuples(size)
        for i in range(size):
            indicatorArray.SetValue(i, int(array.GetValue(i)))

        self.publish('parflow.sandtank.indicator',
            {
            'dimensions': indicatorDimensions,
            'array': self.addAttachment(buffer(indicatorArray).tobytes()),
            }
        )

        # Schedule saturation exchange...
        self.pushSaturation()

    # -------------------------------------------------------------------------

    def pushSaturation(self):
        nextFile = os.path.join(self.workdir, '%s.out.satur.%s.pfb' % (self.runName, str(self.lastProcessedTimestep + 1).zfill(5)))
        if os.path.exists(nextFile):
            self.lastProcessedTimestep += 1
            self.pfbReader.FileNames=[nextFile]
            self.pfbReader.UpdatePipeline()
            imageData = self.pfbReader.GetClientSideObject().GetOutput().GetBlock(0)
            array = imageData.GetCellData().GetArray(0)
            size = array.GetNumberOfTuples()

            # Data convertion
            saturationArray = vtkUnsignedCharArray()
            saturationArray.SetNumberOfTuples(size)
            for i in range(size):
                value = array.GetValue(i)
                if value >= 1.0:
                    saturationArray.SetValue(i, 255)
                elif value < 0.0:
                    saturationArray.SetValue(i, 0)
                else:
                    saturationArray.SetValue(i, int(value * 255))
            print('push %s' % nextFile)
            self.publish('parflow.sandtank.saturation', {
                'time': self.lastProcessedTimestep,
                'array': self.addAttachment(buffer(saturationArray).tobytes())
            })
            reactor.callLater(1, lambda: self.pushSaturation())
        else:
            reactor.callLater(0.5, lambda: self.pushSaturation())

    # -------------------------------------------------------------------------

    @exportRpc("parflow.sandtank.solid.mask")
    def getSolidMask(self, scale=4):
        sampling = [v * scale if v > 1 else 1 for v in self.domain['dimensions']]
        filePath = os.path.join(self.workdir, 'SandTank.vtk')
        solidGeometry = simple.LegacyVTKReader(FileNames=[filePath])
        solidImage = simple.ResampleToImage(Input=solidGeometry, SamplingBounds=self.domain['bounds'], SamplingDimensions=sampling)
        solidImage.UpdatePipeline()
        mask = solidImage.GetClientSideObject().GetOutput().GetPointData().GetArray('vtkValidPointMask')
        return {
            'scale': scale,
            'array': self.addAttachment(buffer(mask).tobytes()),
        }

    # -------------------------------------------------------------------------

    def getLastTimeStep(self):
        count = 0
        filePattern = os.path.join(self.workdir, '%s.out.satur.%s.pfb')
        while os.path.exists(filePattern % (self.runName, str(count + 1).zfill(5))):
            count += 1
        return count

    # -------------------------------------------------------------------------

    @exportRpc("parflow.sandtank.initialize")
    def getServerState(self):
        self.pushIndicator()
        filePath = os.path.join(self.workdir, 'domain.json')
        with open(filePath) as f:
            self.domain = json.load(f)
        return self.domain
