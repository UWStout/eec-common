#!/bin/bash

# copy latest media images if found
if [ -e ../Media/Instruction\ Images/ ]; then
  echo "Copying images to static public folder ..."
  cp ../Media/Instruction\ Images/*.png ./public/media/
fi

if [ -e ../Extension-SP2021/KarunaEEC-Extension.zip ]; then
  echo "Copying extension zip to static public folder ..."
  cp ../Extension-SP2021/KarunaEEC-Extension.zip ./public/media/KarunaEEC-Extension
fi
