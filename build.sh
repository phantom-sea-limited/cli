rm -rf ./dist/
webpack --config webpack.config.js
sed -i "1i\\#\!\/usr\/bin\/env node\n" ./dist/index.js