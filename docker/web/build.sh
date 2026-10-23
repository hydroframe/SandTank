#!/usr/bin/env bash

# Usage:
#   bash build.sh [docker|podman] [tag] [publish]
# Examples:
#   bash build.sh podman latest           # build only
#   bash build.sh podman latest publish   # build and push to docker.io/hydroframe/sandtank:latest

SCRIPT_DIR=`dirname "$0"`
DOCKER=$1
TAG=$2
PUBLISH=$3
if [[ $DOCKER == "" ]]; then DOCKER=docker ; fi
if [[ $TAG == "" ]]; then TAG=test ; fi
if [[ $PUBLISH != "" && $PUBLISH != "publish" ]]; then
    echo "Unknown third argument '$PUBLISH'; expected 'publish' or nothing" >&2
    exit 1
fi

# Remove old docker image and any dangling (non tagged images)
# This prevents CI/CD builds from accumulating old copies of docker images
${DOCKER} image rm sandtank:${TAG}
${DOCKER} rmi $(${DOCKER} images -f "dangling=true" -q)

BUILD_ARGS=""
if [[ $DOCKER == "podman" ]]; then BUILD_ARGS="--build-arg BASE_IMAGE=localhost/sandtank-runtime:latest" ; fi

$DOCKER build $BUILD_ARGS -t localhost/sandtank:${TAG} $SCRIPT_DIR || exit 1

if [[ $PUBLISH == "publish" ]]; then
    $DOCKER tag sandtank:${TAG} docker.io/hydroframe/sandtank:${TAG}
    $DOCKER push docker.io/hydroframe/sandtank:${TAG}
fi
