#!/usr/bin/env bash

# $1 should be the last version, and $2 should be the new version

sed -i "s/branch=v$1/branch=v$2/g" README.md
git add README.md

# @semantic-release/git will commit this change later
