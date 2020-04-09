# ParFlow Sandtank

This application aims to provide a standalone solution for simulating a specific Sand tank setup using ParFlow and an interactive Web UI for adjusting the various parameters that can be adjusted by the user.

____
## Table of Contents:
1. [ Building docker images](#builddocker)
1. [ Publish docker images to HydroFrame](#publishdocker)
1. [ Manage docker image as a file archive](#managearchive)
1. [ Development setup](#devsetup)

____
<a name="builddocker"></a>
## 1. Building docker images

### Docker Development

This will create a local docker image named `sandtank-dev` which will build and install ParaFlow+EcoSlim with all its dependency along with ParaView-5.7.

```sh
cd ./docker/development
./build.sh
```

### Docker Runtime

This will create a local docker image named `sandtank-runtime` which only copy the end products from `sandtank-dev` into a more light-weight image meant to just run the application.

```sh
cd ./docker/runtime
./build.sh
```

### Docker Web

This will create a local docker image named `pvw-sandtank-runtime` that extend `sandtank-runtime` with the ParaViewWeb infrastructure for managing web server and process manager.

```sh
cd ./docker/web
./build.sh
```

____
<a name="publishdocker"></a>
## 2. Publish docker images to HydroFrame

Before anything you need to login into docker-hub by running the following command lines:

```sh
docker login
```

Then provide your `Docker` ID and password at the prompts.
To tag your image, the command looks like:

```sh
docker tag <local-image-tag> <desired-tag-name-for-registry>
```

For example in our use case we will publish the following set of images:

- sandtank-runtime     => hydroframe/sandtank:runtime
- pvw-sandtank-runtime => hydroframe/sandtank:web-service

```sh
docker tag sandtank-runtime hydroframe/sandtank:runtime
docker push hydroframe/sandtank:runtime
```

```sh
docker tag pvw-sandtank-runtime hydroframe/sandtank:web-service
docker push hydroframe/sandtank:web-service
```

____
<a name="managearchive"></a>
## 3. Manage docker image as a file archive

If network is not available it can be convenient to capture a local docker image so you can share it to someone else through a thumb-drive or any other media.

In order to capture a docker image into a file, you can run the following command line:

```sh
docker save hydroframe/sandtank:web-service | gzip > sandtank-web-service.tar.gz
```

Then once the user want to import that image to its local running docker, the following command line can be used:

```sh
docker load < sandtank-web-service.tar.gz
```

____
<a name="devsetup"></a>
## 4. Development setup
To speed up web development, we need to run 3 process independently like described below

### Web server

```sh
cd client
npm run serve
```

### ParaView process

```sh
cd deploy/pvw
/Applications/ParaView-5.7.0.app/Contents/bin/pvpython ./server/pvw-parflow.py --run devrun --basepath "$PWD/simulations/runs" --port 1234
```

### Launcher for Parflow

```sh
docker run --rm                   \
  -e PROTOCOL="ws"                 \
  -p 0.0.0.0:9000:80                \
  -e SERVER_NAME="localhost:9000"    \
  -v "$PWD/deploy/pvw:/pvw"           \
  -it pvw-sandtank-runtime
```

Use `Ctrl+C` to stop the container.

### Web Client

```sh
open http://localhost:8080/?dev
```
