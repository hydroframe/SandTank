#!/usr/bin/env bash

SCRIPT_DIR=`dirname "$0"`
docker build -t pvw-sandtank-runtime $SCRIPT_DIR
