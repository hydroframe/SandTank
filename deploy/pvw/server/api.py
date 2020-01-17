import os, sys, types, inspect, traceback, logging, re, json, fnmatch, time

from wslink import register as exportRpc

import paraview
from paraview import simple, servermanager
from paraview.web import protocols as pv_protocols

from vtkmodules.vtkCommonCore import vtkUnsignedCharArray
from vtkmodules.vtkCommonDataModel import vtkImageData

# import Twisted reactor for later callback
from twisted.internet import reactor

# =============================================================================
# SandTankEngine protocol
# =============================================================================

class SandTankEngine(pv_protocols.ParaViewWebProtocol):
    def __init__(self, simulationDirectory = '', **kwargs):
        super(ParaViewEngine, self).__init__()
        self.baseDirectory = simulationDirectory


    @exportRpc("parflow.sandtank.update")
    def reloadFiles(self):
        print('reload files in %s' % self.baseDirectory)
