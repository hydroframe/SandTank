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
        self.templateName = 'template'

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

    @exportRpc("parflow.sandtank.initialize")
    def getServerState(self):
        self.pushIndicator()
        filePath = os.path.join(self.workdir, 'domain.json')
        with open(filePath) as f:
            return json.load(f)
        return None
