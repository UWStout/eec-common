#! /bin/bash
pushd assets
magick convert icon-512.png -resize 50%   icon-256.png
magick convert icon-256.png -resize 50%   icon-128.png
magick convert icon-128.png -resize 50%   icon-64.png
magick convert icon-128.png -resize 37.5% icon-48.png
magick convert icon-64.png  -resize 25%   icon-16.png
popd
