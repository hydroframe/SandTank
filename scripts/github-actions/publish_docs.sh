#!/usr/bin/env bash
set -ev

BOT_NAME="hydroframe-bot"
BOT_EMAIL="hydroframe.bot@gmail.com"

git config --global user.name "$BOT_NAME"
git config --global user.email "$BOT_EMAIL"
export GIT_PUBLISH_URL=https://${GITHUB_TOKEN}@github.com/hydroframe/SandTank.git

# Environment variables for semantic-release
export GIT_AUTHOR_NAME=$BOT_NAME
export GIT_AUTHOR_EMAIL=$BOT_EMAIL
export GIT_COMMITTER_NAME=$BOT_NAME
export GIT_COMMITTER_EMAIL=$BOT_EMAIL

npm run semantic-release
npm run doc:publish
