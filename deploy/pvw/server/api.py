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
# Helper method
# =============================================================================

def updateFileSecurity(directoryPath):
    try:
        # Need to make sure that the non-priviledge user on host is 4444:4444
        uid = 4444
        gid = 4444

        for root, dirs, files in os.walk(directoryPath):
            for f in dirs:
                os.chown(os.path.join(root, f), uid, gid)
            for f in files:
                os.chown(os.path.join(root, f), uid, gid)

        os.chown(directoryPath, uid, gid)
    except Exception as e:
        print(str(e))
        print("updateFileSecurity failed for %s" % directoryPath)



# =============================================================================
# SandTankEngine protocol
# =============================================================================

class SandTankEngine(pv_protocols.ParaViewWebProtocol):
    def __init__(self, simulationDirectory = '', templateName = 'template', **kwargs):
        super(SandTankEngine, self).__init__()
        self.runName = os.path.basename(simulationDirectory)
        self.workdir = simulationDirectory
        self.pfbReader = None
        self.vtkReader = None
        self.lastProcessedTimestep = -1
        self.lastEcoSLIMTimestep = -1
        self.lastConfig = None
        self.templateName = templateName
        self.domain = None
        self.refreshRate = 0.5 # in seconds

        simple.LoadDistributedPlugin('ParFlow')
        self.reset()

    # -------------------------------------------------------------------------

    @exportRpc("parflow.sandtank.reset")
    def reset(self):
        '''
        mkdir -p "/pvw/simulations/runs/$runId"
        cd "/pvw/simulations/runs/$runId"

        cp /pvw/simulations/templates/{templateName}/* "/pvw/simulations/runs/$runId/"
        '''
        if os.path.exists(self.workdir):
            shutil.rmtree(self.workdir)

        tplPath = os.path.abspath(os.path.join(self.workdir, '../../templates', self.templateName))
        shutil.copytree(tplPath, self.workdir)
        self.lastProcessedTimestep = -1
        self.lastEcoSLIMTimestep = -1

        updateFileSecurity(self.workdir)


    # -------------------------------------------------------------------------

    @exportRpc("parflow.sandtank.config.update")
    def updateConfiguration(self, config = None):
        if config:
            self.lastConfig = config
        filePath = os.path.abspath(os.path.join(self.workdir, 'config.tcl'))
        startNumber = self.getLastTimeStep()
        if self.lastProcessedTimestep > startNumber:
            self.lastProcessedTimestep = startNumber
            self.lastEcoSLIMTimestep = startNumber

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
                action = 'Extraction' if value < 0 else 'Injection'
                f.write('set well_%s_action     %s\n' % (key, action))
                f.write('set well_%s_value      %s\n' % (key, abs(value)))

        updateFileSecurity(self.workdir)


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

        # Schedule file processing...
        self.processNextFile()

    # -------------------------------------------------------------------------

    def processNextFile(self):
        gotFile = False
        nextSaturationFile = os.path.join(self.workdir, '%s.out.satur.%s.pfb' % (self.runName, str(self.lastProcessedTimestep + 1).zfill(5)))
        nextNextSaturationFile = os.path.join(self.workdir, '%s.out.satur.%s.pfb' % (self.runName, str(self.lastProcessedTimestep + 2).zfill(5)))
        nextPressureFile = os.path.join(self.workdir, '%s.out.press.%s.pfb' % (self.runName, str(self.lastProcessedTimestep + 1).zfill(5)))
        nextConcentrationFile = os.path.join(self.workdir, 'SLIM_SandTank_test_cgrid.%s.vtk' % str(self.lastEcoSLIMTimestep + 1).zfill(8))
        nextNextConcentrationFile = os.path.join(self.workdir, 'SLIM_SandTank_test_cgrid.%s.vtk' % str(self.lastEcoSLIMTimestep + 2).zfill(8))

        if os.path.exists(nextNextConcentrationFile):
            try:
                self.pushConcentration(nextConcentrationFile)
                self.lastEcoSLIMTimestep += 1
                gotFile = True
            except:
                print('Error in concentration file: %s' % self.lastEcoSLIMTimestep)

        if os.path.exists(nextNextSaturationFile):
            try:
                self.pushSaturation(nextSaturationFile)
                self.pushPressureData(nextPressureFile)
                self.lastProcessedTimestep += 1
                gotFile = True
            except:
                print('Error in saturation/pressure file %s' % self.lastProcessedTimestep)

        if gotFile:
            reactor.callLater(self.refreshRate, lambda: self.processNextFile())
        else:
            reactor.callLater(self.refreshRate / 3.0, lambda: self.processNextFile())

    # -------------------------------------------------------------------------

    def pushPressureData(self, pressureFile):
        if os.path.exists(pressureFile):
            pressures = {}
            self.pfbReader.FileNames=[pressureFile]
            self.pfbReader.UpdatePipeline()
            imageData = self.pfbReader.GetClientSideObject().GetOutput().GetBlock(0)
            array = imageData.GetCellData().GetArray(0)

            # Extract pressures
            dims = self.domain['dimensions']
            for press in self.domain['pressures']:
                key = press['name']
                i, j, k = press['pressureCell']
                value = array.GetValue(i + j * dims[0] + k * dims[0] * dims[1])
                pressures[key] = value
            self.publish('parflow.sandtank.pressures', pressures)

            # Extract flows
            flows = {}
            for flow in self.domain['flows']:
                key = flow['name']
                ratio = flow['ratio']
                totalFlow = 0.0
                for cellId in flow['cells']:
                    p = array.GetValue(cellId)
                    if p > 0.0:
                        totalFlow += ratio*(p**(5.0/3.0))
                flows[key] = totalFlow
            self.publish('parflow.sandtank.flows', flows)

            # Extract storage
            storages = {}
            for storage in self.domain['storages']:
                key = storage['name']
                ratio = storage['ratio']
                totalStorage = 0.0
                for cellId in storage['cells']:
                    p = array.GetValue(cellId)
                    if p > 0.0:
                        totalStorage += ratio*p
                storages[key] = totalStorage
            self.publish('parflow.sandtank.storages', storages)

    # -------------------------------------------------------------------------

    def pushSaturation(self, saturationFile):
        if os.path.exists(saturationFile):
            self.pfbReader.FileNames=[saturationFile]
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
            print('push %s' % saturationFile)
            self.publish('parflow.sandtank.saturation', {
                'time': self.lastProcessedTimestep,
                'array': self.addAttachment(buffer(saturationArray).tobytes())
            })

    # -------------------------------------------------------------------------

    def pushConcentration(self, ecoSlimFile):
        if os.path.exists(ecoSlimFile):
            if self.vtkReader:
                self.vtkReader.FileNames = [ecoSlimFile]
            else:
                self.vtkReader = simple.LegacyVTKReader(FileNames=[ecoSlimFile])

            self.vtkReader.UpdatePipeline()
            imageData = self.vtkReader.GetClientSideObject().GetOutput()

            if imageData:
                array = imageData.GetCellData().GetArray('Concentration')
                size = array.GetNumberOfTuples()
                dataRange = array.GetRange(0)

                print('push %s' % ecoSlimFile)
                self.publish('parflow.sandtank.concentration', {
                    'time': self.lastEcoSLIMTimestep,
                    'range': dataRange,
                    'array': self.addAttachment(buffer(array).tobytes())
                })
            elif self.lastEcoSLIMTimestep > -1:
                self.lastEcoSLIMTimestep -= 1

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

        self.refreshRate = self.domain['server']['refreshRate']

        return self.domain
