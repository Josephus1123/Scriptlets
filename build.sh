#!/bin/bash

yarn install

yarn test
yarn browserstack

yarn corelibs
yarn build

yarn wiki:check-updates
