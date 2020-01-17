# ParFlow Sandtank

This application aims to provide a standalone solution for simulating a specific Sand tank setup using ParFlow and an interactive Web UI for adjusting the various parameters that can be adjusted by the user.

## Building docker images

We provide a custom docker image that will encapsulate all the software required to run this application.

To build the `development` image, just run the following command line

```
cd parflow-sandtank/docker/development
./build.sh
```

## Running a standalone ParFlow run

```
cd sample
./run.sh SandTank.tcl
```

## Runing the Web application

### Build the web application

```
cd client
npm install
npm run build
cd ..
```

### Run it via docker

```
docker run -v "$PWD/deploy/pvw:/pvw -t pvw-parflow
```
