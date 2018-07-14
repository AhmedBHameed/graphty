var UglifyJS = require("uglify-js");
var fs = require('fs');

var code = fs.readFileSync('./@graphty/dist/graphty.umd.js', 'utf-8');
var ugl = UglifyJS.minify(code, {
   ie8: true,
   sourceMap: true,
   compress: true,
   mangle: true
});

if(!ugl.error) {
   fs.writeFileSync('./@graphty/dist/graphty.umd.min.js', ugl.code);
} else {
   console.error(ugl.error);
}