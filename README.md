# ParFlow Sandtank

This application aims to provide a standalone solution for simulating a specific Sand tank setup using ParFlow and an interactive Web UI for adjusting the various parameters that can be adjusted by the user.

## Building docker images

### Docker Development

```
cd ./docker/development
./build.sh
```

### Docker Web

```
cd ./docker/web
./build.sh
```

## Build the web client

```
cd ./client
npm install
npm run build
```

## Run Web application with docker

```
cd ./
docker run --rm                   \
  -e PROTOCOL="ws"                 \
  -p 0.0.0.0:9000:80                \
  -e SERVER_NAME="localhost:9000"    \
  -v "$PWD/deploy/pvw:/pvw"           \
  -it pvw-parflow
```

Open your browser to `http://localhost:9000/`

Use `Ctrl+C` to stop the container.

## Development setup

To speed up web programing, we need to run 3 process independently like described below

### Web server

```
cd client
npm run serve
```

### ParaView process

```
cd deploy/pvw
/Applications/ParaView-5.7.0.app/Contents/bin/pvpython ./server/pvw-parflow.py --run devrun --basepath "$PWD/simulations/runs" --port 1234
```

### Launcher for Parflow

```
docker run --rm                   \
  -e PROTOCOL="ws"                 \
  -p 0.0.0.0:9000:80                \
  -e SERVER_NAME="localhost:9000"    \
  -v "$PWD/deploy/pvw:/pvw"           \
  -it pvw-parflow
```

Use `Ctrl+C` to stop the container.

### Web Client

```
open http://localhost:8080/?dev
```
