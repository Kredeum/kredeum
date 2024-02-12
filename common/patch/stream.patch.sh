#/bin/sh

# `source stream.patch.sh` to apply patch
# `source stream.patch.sh -R` to revert patch

DIR="../node_modules/@ethersphere/bee-js/dist/mjs/utils"
cp $DIR/stream.js .

git apply stream.patch $1 2>> /dev/null && cp ./stream.js $DIR

rm stream.js
