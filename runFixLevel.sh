#!/bin/bash
cd ~/Programowanie/javascript/tiled_arcade/current
JSON_FILE=$(echo $1 | sed s/\.tmx/\.json/g)
echo $JSON_FILE
#node ./fixLevel.js $JSON_FILE