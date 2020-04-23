title: Web Application
---

This section provide some background on how to isolate each part of the Web development and enable fast turn around in the application development and validation for either the client or server of the web application.

To achieve full control on the *client side*, *server side* and *simulation code*, we need to run 3 process independently as described below

### Web server

The following command will run a development web server that will automatically update the web content while you are editing the code. This is ideal for seeing your HTML/CSS and JavaScript change live. The web content should be accessed with the following URL assuming the port 8080 was actually available: `http://localhost:8080/?dev`

```sh
cd client
npm run serve
```

### ParaView process

That following command will start the ParaViewWeb process which drives the visualization and configures the simulation run. This is typically executing the python code inside `./server/*.py` while storing the simulation results inside `$PWD/simulations/runs/devrun/*`. Each time you are editing a Python file, you should restart the process and reload your web-page.

This workflow could also be convenient when developing a *template* as the outputs of the run will always be in the same directory which could then be easily monitored.

In that part we assume you have a downloaded version of ParaView on which we just use its *pvpython* executable for running our ParaViewWeb application.

```sh
cd deploy/pvw
/Applications/ParaView-5.7.0.app/Contents/bin/pvpython ./server/pvw-parflow.py --run devrun --basepath "$PWD/simulations/runs" --port 1234
```

### Launcher for Parflow

The following command will start the docker image which will provide the ParFlow execution infrastructure.
To debug *templates* and *simulation executions*, you should look into the `$PWD/deploy/pvw/launcher/logs/*` directories for the execution logs.

```sh
docker run --rm                   \
  -e PROTOCOL="ws"                 \
  -p 9000:80                        \
  -e SERVER_NAME="localhost:9000"    \
  -v "$PWD/deploy/pvw:/pvw"           \
  -it hydroframe/sandtank:web-service
```

Use `Ctrl+C` to stop the container.
