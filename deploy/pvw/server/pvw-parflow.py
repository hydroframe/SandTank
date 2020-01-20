r"""
    This module is a Parflow(web) server application.
    The following command line illustrates how to use it::

        $ pvpython -dr .../pvw-parflow.py --run Q2345trasdfWFasdf

        --run
             Identifier of the user run

    Any ParaViewWeb executable script comes with a set of standard arguments that can be overriden if need be::

        --port 8080
             Port number on which the HTTP server will listen.

        --content /path-to-web-content/
             Directory that you want to serve as static web content.
             By default, this variable is empty which means that we rely on another
             server to deliver the static content and the current process only
             focuses on the WebSocket connectivity of clients.

        --authKey vtkweb-secret
             Secret key that should be provided by the client to allow it to make
             any WebSocket communication. The client will assume if none is given
             that the server expects "vtkweb-secret" as secret key.

"""

# import to process args
import os
import sys

# Try handle virtual env if provided
if '--virtual-env' in sys.argv:
  virtualEnvPath = sys.argv[sys.argv.index('--virtual-env') + 1]
  virtualEnv = virtualEnvPath + '/Scripts/activate_this.py'
  exec(open(virtualEnv).read(), dict(__file__=virtualEnv))


# import paraview modules.
from paraview.web import pv_wslink

from paraview.web import protocols as pv_protocols

# import RPC annotation
from wslink import register as exportRpc

from paraview import simple
from wslink import server

import api as parflow_api

import argparse

# =============================================================================
# Create custom Pipeline Manager class to handle clients requests
# =============================================================================

class _Server(pv_wslink.PVServerProtocol):

    basepath = os.getcwd()
    authKey = "wslink-secret"

    @staticmethod
    def add_arguments(parser):
        parser.add_argument("--virtual-env", default=None, help="Path to virtual environment to use")
        parser.add_argument("--run", default='default', help="Identifier for simulation runs", dest="run")
        parser.add_argument("--basepath", default=os.getcwd(), help="Directory where runs are executed", dest="basepath")


    @staticmethod
    def configure(args):
        _Server.authKey    = args.authKey
        _Server.sessionId  = args.run
        _Server.basepath   = args.basepath

    def initialize(self):
        self.registerVtkWebProtocol(parflow_api.SandTankEngine(os.path.join(_Server.basepath, _Server.sessionId)))

        # Update authentication key to use
        self.updateSecret(_Server.authKey)

# =============================================================================
# Main: Parse args and start server
# =============================================================================

if __name__ == "__main__":
    # Create argument parser
    parser = argparse.ArgumentParser(description="ParFlow - SandTank Engine")

    # Add arguments
    server.add_arguments(parser)
    _Server.add_arguments(parser)
    args = parser.parse_args()
    _Server.configure(args)
    # Start server
    server.start_webserver(options=args, protocol=_Server)
