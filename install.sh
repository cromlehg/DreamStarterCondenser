#!/bin/bash
BUILD_DIR="tmp"
if [ ! -d "$BUILD_DIR" ]; then
  mkdir $BUILD_DIR
fi
yarn run build
