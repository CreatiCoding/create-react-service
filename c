rm -rf $1/package-lock.json
rm -rf $2/package-lock.json
rm -rf $1/node_modules/
rm -rf $1/build
rm -rf $2/node_modules/
rm -rf $2/build
colordiff <(tree ./$2) <(tree ./$1)
