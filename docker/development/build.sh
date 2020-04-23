#!/usr/bin/env bash

# This will be ran with the root directory as the docker context

SCRIPT_DIR=`dirname "$0"`
ROOT_DIR=$SCRIPT_DIR/../..
docker build -t sandtank-dev -f $SCRIPT_DIR/Dockerfile $ROOT_DIR
