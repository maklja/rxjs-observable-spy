#!/bin/bash

# install dependencies, build a project and run tests
npm install
npm run build
npm test

# remove the test directory and move everything from src folder to route
# optimization of what will go into the npm package
rm -rf dist/test
mv -v dist/src/* dist/
rm -rf dist/src