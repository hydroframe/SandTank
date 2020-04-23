#!/usr/bin/env bash

# This creates a DOCKER_TAG environment variable that contains the
# docker tag. It assumes the REF environment variable has been set
# to github.ref

# If a git tag was pushed, use the git tag for the docker tag
# Otherwise, use "latest"

if [[ $REF == refs/tags/* ]]
then
  echo "::set-env name=DOCKER_TAG::${REF#'refs/tags/'}"
else
  echo "::set-env name=DOCKER_TAG::latest"
fi
