import os, sys, types, inspect, traceback, logging, re, json, fnmatch, time

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
        self.workdir = simulationDirectory
        simple.LoadDistributedPlugin('ParFlow')
        self.indicatorArray = None
        self.indicatorDimensions = None
        self.pfbReader = None

        self.lastProcessedTimestep = -1
        self.runName = os.path.basename(self.workdir)
        self.saturationArray = None

    @exportRpc("parflow.sandtank.indicator")
    def getIndicator(self):
        print('getIndicator')
        if self.indicatorArray:
            return {
                'dimensions': self.indicatorDimensions,
                'array': self.addAttachment(buffer(self.indicatorArray).tobytes()),
            }

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

        self.indicatorDimensions = imageSize
        self.indicatorArray = vtkUnsignedCharArray()
        self.indicatorArray.SetNumberOfTuples(size)
        for i in range(size):
            self.indicatorArray.SetValue(i, int(array.GetValue(i)))


        # Schedule saturation exchange...
        self.pushSaturation()

        return {
            'dimensions': self.indicatorDimensions,
            'array': self.addAttachment(buffer(self.indicatorArray).tobytes()),
        }


    def pushSaturation(self):
        nextFile = os.path.join(self.workdir, '%s.out.satur.%s.pfb' % (self.runName, str(self.lastProcessedTimestep + 1).zfill(5)))
        if os.path.exists(nextFile):
            self.lastProcessedTimestep += 1
            self.pfbReader.FileNames=[nextFile]
            self.pfbReader.UpdatePipeline()
            imageData = self.pfbReader.GetClientSideObject().GetOutput().GetBlock(0)
            array = imageData.GetCellData().GetArray(0)
            size = array.GetNumberOfTuples()

            if not self.saturationArray:
                self.saturationArray = vtkUnsignedCharArray()

            self.saturationArray.SetNumberOfTuples(size)
            for i in range(size):
                value = array.GetValue(i)
                if value >= 1.0:
                    self.saturationArray.SetValue(i, 255)
                elif value < 0.0:
                    self.saturationArray.SetValue(i, 0)
                else:
                    self.saturationArray.SetValue(i, int(value * 255))
            print('push %s' % nextFile)
            self.publish('parflow.sandtank.saturation', self.addAttachment(buffer(self.saturationArray).tobytes()))

        reactor.callLater(0.5, lambda: self.pushSaturation())
