#!/usr/bin/env bash

SCRIPT_DIR=`dirname "$0"`
DOCKER=$1
TAG=$2
if [[ $DOCKER == "" ]]; then DOCKER=docker ; fi
if [[ $TAG == "" ]]; then TAG=test ; fi

# Remove old docker image and any dangling (non tagged images)
# This prevents CI/CD builds from accumulating old copies of docker images
${DOCKER} image rm sandtank:${TAG}
${DOCKER} rmi $(${DOCKER} images -f "dangling=true" -q)

BUILD_ARGS=""
if [[ $DOCKER == "podman" ]]; then BUILD_ARGS="--build-arg BASE_IMAGE=localhost/sandtank-runtime:latest" ; fi

$DOCKER build $BUILD_ARGS -t localhost/sandtank:${TAG} $SCRIPT_DIR
$DOCKER tag sandtank:${TAG} docker.io/hydroframe/sandtank:${TAG}
$DOCKER push docker.io/hydroframe/sandtank:${TAG}
