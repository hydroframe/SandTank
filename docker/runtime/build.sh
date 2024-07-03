#!/usr/bin/env bash

# This builds the sandtank-runtime docker image from the git repo pull in the current directory
# This is the second base image of the sandtank application. This is used by the web docker image build.
# This will be run with the root directory as the docker context

# Usage to build using docker (on a laptop):
#   bash build.sh
# Usage to build using podman (on Princeton linux servers that use podman)
#   bash build.sh podman

SCRIPT_DIR=`dirname "$0"`
DOCKER=$1
if [[ $DOCKER == "" ]]; then DOCKER=docker ; fi

# Remove old docker image and any dangling (non tagged images)
# This prevents CI/CD builds from accumulating old copies of docker images
${DOCKER} image rm sandtank-runtime:latest
${DOCKER} rmi $(${DOCKER} images -f "dangling=true" -q)

$DOCKER build -t sandtank-runtime $SCRIPT_DIR
