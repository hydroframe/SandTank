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

        print('File exists: %s' % filePath)

        reader = simple.PFBreader(FileNames=[filePath], IsCLMFile = 'No')
        reader.UpdatePipeline()

        print('Read PFB')

        imageData = reader.GetClientSideObject().GetOutput().GetBlock(0)
        imageSize = [v - 1 for v in imageData.GetDimensions()]
        array = imageData.GetCellData().GetArray(0)
        size = array.GetNumberOfTuples()

        print('imageSize', imageSize)
        print('size', size)
        print('array', array)

        self.indicatorDimensions = imageSize
        self.indicatorArray = vtkUnsignedCharArray()
        self.indicatorArray.SetNumberOfTuples(size)
        for i in range(size):
            self.indicatorArray.SetValue(i, int(array.GetValue(i)))

        simple.Delete(reader)

        return {
            'dimensions': self.indicatorDimensions,
            'array': self.addAttachment(buffer(self.indicatorArray).tobytes()),
        }


