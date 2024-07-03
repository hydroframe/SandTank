#!/usr/bin/env bash

# This builds the sandtank-dev docker image from the git repo pull in the current directory
# This is the a base image of the sandtank application. 
# This image is used by the docker image built by docker/runtime folder.
# The image built by the docker/runtime folder is used by the image built by docker/web folder.
# The image from docker/web folder is run in a container to deploy Sandtank.

# Usage to build using docker (on a laptop):
#   bash build.sh
# Usage to build using podman (on Princeton linux servers that use podman)
#   bash build.sh podman

SCRIPT_DIR=`dirname "$0"`
ROOT_DIR=$SCRIPT_DIR/../..
DOCKER=$1
if [[ $DOCKER == "" ]]; then DOCKER=docker ; fi

# Remove old docker image and any dangling (non tagged images)
# This prevents CI/CD builds from accumulating old copies of docker images
${DOCKER} image rm sandtank-dev:latest
${DOCKER} rmi $(${DOCKER} images -f "dangling=true" -q)

# Build docker image of sandtank dev
$DOCKER build -t sandtank-dev -f $SCRIPT_DIR/Dockerfile $ROOT_DIR
