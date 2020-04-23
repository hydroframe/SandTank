#!/usr/bin/env bash

SCRIPT_DIR=`dirname "$0"`
docker build -t hydroframe/sandtank:latest $SCRIPT_DIR
