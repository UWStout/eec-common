#!/bin/bash
echo "Copying images and media to static public folder ..."
cp ../Media/Instruction\ Images/*.png ./public/media/
if [ -e ../ExtensionRefactor/KarunaEEC-Extension.zip ]; then
  cp ../ExtensionRefactor/KarunaEEC-Extension.zip ./public/media/
fi

echo "Copying JS libraries to static public folder ..."
nodeLibs=(
  "axios/dist/axios.min.js"
  "bootstrap/dist/js/bootstrap.bundle.min.js"
  "bootstrap/dist/css/bootstrap.min.css"
  "eventemitter3/umd/eventemitter3.min.js"
  "jquery/dist/jquery.slim.min.js"
  "js-cookie/src/js.cookie.js"
  "socket.io/client-dist/socket.io.min.js"
  "store2/dist/store2.min.js"
)

rm -rf ./public/lib
mkdir ./public/lib
for libFile in "${nodeLibs[@]}"; do
  cp "./node_modules/$libFile" "./public/lib"
done
