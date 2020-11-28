#!/bin/bash
zipFileName='KarunaEEC-Extension.zip'

pushd dist
if [ -f "${zipFileName}" ]; then
  rm "${zipFileName}"
fi
zip -r9 "${zipFileName}" ./*
mv "${zipFileName}" ../
popd
