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
docker run                        \
  -e PROTOCOL="ws"                 \
  -p 0.0.0.0:9000:80                \
  -e SERVER_NAME="localhost:9000"    \
  -v "$PWD/deploy/pvw:/pvw            \ 
  -t pvw-parflow
```

Open your browser to `http://localhost:9000/`

