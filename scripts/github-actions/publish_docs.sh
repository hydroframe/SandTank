#!/usr/bin/env bash
set -ev

git config --global user.name "hydroframe-bot"
git config --global user.email "hydroframe.bot@gmail.com"
export GIT_PUBLISH_URL=https://${GITHUB_TOKEN}@github.com/hydroframe/SandTank.git
npm run semantic-release
npm run doc:publish
