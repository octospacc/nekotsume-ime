#!/bin/sh
set -e

# Get dependencies
git submodule update --init --recursive

# Build lib/igo.min.js
cd lib/igo-javascript
npm install
cd build
node build.js
cp igo.min.js ../../igo.min.js
cd ../../..

# Build lib/zip.min.js
cd lib/zipjs
echo 'Uin32Array=Uint32Array;' > ../zip.min.js
cat zip.js jsinflate.js sjis.js >> ../zip.min.js
cd ../..

# Build WebExtension package
npm install web-ext
web-ext build --overwrite-dest --ignore-files logo.xcf demo.html screenshot.png build.sh lib/*/
