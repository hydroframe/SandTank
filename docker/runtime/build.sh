#!/usr/bin/env bash

SCRIPT_DIR=`dirname "$0"`
docker build -t sandtank-runtime $SCRIPT_DIR
