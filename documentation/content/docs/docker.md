title: Docker
---

The ParaFlow Sandtank relies on a docker image to serve the web application along with the infrastructure to run the simulation codes and visualization server. This provides a streamlined execution and deployment of the application.

The sections below mainly focus on how a maintainer can rebuild each component that compose that end-product docker image.

The following set of users can safely skip this section and simply use the publicly available image under the name `hydroframe/sandtank:web-service` on DockerHub. The workflow for this level of development is provided in the template section.

Users that can safely skip the Docker Build section:
- User that want to create/edit a *template*
- User that want to develop the *Web application (client)*
- User that want to develop the *ParaViewWeb server side API (server)*

### Building docker images

The following steps build the docker application. If you would like to run it you should follow the instructions to *Build the Web Client* and *Run Web Application* that are included in the main *README* after you have completed these steps.  Alternatively you can also follow the instructions for running the [ web application ](web_application.html).

In general the steps below are not needed for the users as the end-product image is publicly available. Therefore if your goal is just to develop new *templates* or even make some *Web tweaks* you can achieve them without the build steps below.

These steps are mainly given as reference for when a new version of ParFlow or any other code is required after editing the DockerFile definitions.

#### Docker Development

This will create a local docker image named `sandtank-dev` which will build and install ParaFlow+EcoSlim with all its dependency along with ParaView-5.7.

```sh
cd ./docker/development
./build.sh
```

#### Docker Runtime

This will create a local docker image named `sandtank-runtime` which will only copy the end products from `sandtank-dev` into a more light-weight image meant to just run the application.

```sh
cd ./docker/runtime
./build.sh
```

#### Docker Web

This will create a local docker image named `pvw-sandtank-runtime` that extends `sandtank-runtime` with the ParaViewWeb infrastructure for managing web server and process manager.

```sh
cd ./docker/web
./build.sh
```

### Publish docker images to HydroFrame
Updated sand tank versions should be published to the HydroFrame docker-hub and tagged.

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

### Manage docker image as a file archive

If network is not available it can be convenient to capture a docker image so you can share it to someone else through a thumb-drive or any other media.

In order to capture a docker image into a file, you can run the following command line:

```sh
docker save hydroframe/sandtank:web-service | gzip > sandtank-web-service.tar.gz
```

Then once the user want to import that image to its local running docker, the following command line can be used:

```sh
docker load < sandtank-web-service.tar.gz
```
