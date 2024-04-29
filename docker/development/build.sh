#!/usr/bin/env bash

# This builds the sandtank-dev docker image from the git repo pull in the current directory
# This is the first base image of the sandtank application. This is used by the runtime docker image build.
# This will be run with the root directory as the docker context

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
