studio
[![Build Status](https://travis-ci.org/santech-org/studio.svg?branch=master)](https://travis-ci.org/santech-org/studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
========

studio are npm module that exports core modules of the santech company

## Prerequisites

You need to have globally installed:

* node 9.x.x
* npm 5.x.x
* yarn 1.0.0

## Development

As you are on a mono repo some dependencies are linked. We are using lerna to achieve this. You can install it globally or locally at your convinience.

```
# Globally
npm i -g lerna

# Locally
yarn
```

Once you're set, you need to install packages dependencies running

```
yarn
```

Postinstall runs build to make mono repository up and running. Feel free to use `--ignore-scripts` flag.

## Build

The build process performs 3 actions

 - lint
 - test
 - build

To validate your development you can use this commands

```
# Globally
lerna run lint
lerna run test
lerna run build

# Locally
yarn lint
yarn test
yarn build
```

## Publish

Our Jenkins take care for you of the publication. The only thing you need to do is to set the version you want to publish in the studio package.json and run

```
./scripts/upgrade.sh
```

This will update each package file to perform the publication.

No previously published version will be published again by Jenkins
