var sass = require('node-sass');
var fs = require('fs');
var path = require('path');
var conf = require('../configuration');
var minify = require('html-minifier').minify;

var config, fileContent, inlineCss, inlineTemplate,
    templateUrl, styleUrls = [];


function addInlineName(path) {
    var pathWithInlineArray = [], pathArray = path.split('.');
    for(var i=0; i < pathArray.length; i++) {
        if (i == (pathArray.length - 1)) {
            pathWithInlineArray.push('inline');
            pathWithInlineArray.push(pathArray[i]);
        } else {
            pathWithInlineArray.push(pathArray[i]);
        }
    }
    return pathWithInlineArray.join('.');
}
function resolve(url) {
    return path.resolve(path.dirname(config.input), url || '');
}
function extractFile(path, data) {
    fs.writeFileSync(path, data);
}
function extractComponentUrls() {
    fileContent = fs.readFileSync(config.input, 'utf-8');
    templateUrl = eval(fileContent.match(/templateUrl:\s*[`'"]([^`'"]+?\.html)[`'"]/g)[0]);
    styleUrls = eval(fileContent.match(/styleUrls:\s*(\[[\s\S]*?\])/gm)[0]);
}

function readResolvedUrlFiles() {
    if(styleUrls[0].indexOf('.scss') > -1) {
        inlineCss = sass.renderSync({
            file: resolve(styleUrls[0]),
            outputStyle : config.outputStyle
        }).css;
    } else if (styleUrls[0].indexOf('.scss') > -1 ){
        inlineCss = fs.readFileSync(resolve(styleUrls[0]), 'utf-8');
    }
    inlineTemplate = minify(fs.readFileSync(resolve(templateUrl), 'utf-8'), {
        ignoreCustomFragments: [ /\{\{[\s\S]*?\}\}/ ],
        caseSensitive: true,
        removeComments: true,
        collapseWhitespace: true
    });
    var targDir = path.dirname(config.input);
    if (!fs.existsSync(targDir)) {
        fs.mkdirSync(targDir);
    }
    pushInlineMetadata();
}

function pushInlineMetadata(){
    fileContent = fileContent.replace(/templateUrl:\s*[`'"]([^`'"]+?\.html)[`'"]/g, function (_m) {
        return 'template: `' + inlineTemplate.replace(/([\n\r]\s*)+/gm, ' ').replace(/"/g, '\\"') + '`';
    });
    extractFile(addInlineName('lib/test.css'), inlineCss);
    fileContent = fileContent.replace(/styleUrls:\s*(\[[\s\S]*?\])/gm, function(_m){
        return 'styles: [`' + inlineCss.toString().replace(/([\n\r]\s*)+/gm, ' ').replace(/"/g, '\\"') + '`]';
    });
    extractFile(addInlineName(config.input), fileContent);
}

/**
 * Inline the templates for a source file. Simply search for instances of `templateUrl: ...` and
 * replace with `template: ...` (with the content of the file included).
 * @param content {string} The source file's content.
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @return {string} The content with all templates inlined.
 */
function inlineTemplate(content) {
    return content.replace(/templateUrl:\s*[`'"]([^`'"]+?\.html)[`'"]/g, function (_m, templateUrl) {
        return templateUrl;
        // const templateFile = urlResolver(templateUrl);
        // const templateContent = fs.readFileSync(templateFile, 'utf-8');
        // const shortenedTemplate = templateContent
        //     .replace(/([\n\r]\s*)+/gm, ' ')
        //     .replace(/"/g, '\\"');
        // return `template: "${shortenedTemplate}"`;
    });
}

function temStyLiner(options) {
    options = options || null;
    if (!options) throw new Error('Invalid configuration!!');
    config = Object.assign({
        style: { outputStyle: 'expanded' }
    }, options);

    extractComponentUrls();
    readResolvedUrlFiles();
}

/**
 * Inline the styles for a source file. Simply search for instances of `styleUrls: [...]` and
 * replace with `styles: [...]` (with the content of the file included).
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @param content {string} The source file's content.
 * @return {string} The content with all styles inlined.
 */
// function inlineStyle(content, urlResolver) {
//     return content.replace(/styleUrls:\s*(\[[\s\S]*?\])/gm, function (_m, styleUrls) {
//         const urls = eval2(styleUrls);
//         return 'styles: ['
//             + urls.map((styleUrl) => {
//                 const styleFile = urlResolver(styleUrl);
//                 const styleContent = fs.readFileSync(styleFile, 'utf-8');
//                 const shortenedStyle = styleContent
//                     .replace(/([\n\r]\s*)+/gm, ' ')
//                     .replace(/"/g, '\\"');
//                 return `"${shortenedStyle}"`;
//             })
//                 .join(',\n')
//             + ']';
//     });
// }

// function compileSass(options) {
//     // set default options


//     // render the result
//     var result = sass.renderSync({
//         file: options.input,
//         outputStyle: options.output
//     });

//     // write the result to file
//     var targDir = path.dirname(options.dest);
//     if (!fs.existsSync(targDir)) {
//         fs.mkdirSync(targDir);
//     }
//     fs.writeFileSync(options.dest, result.css);


//     var txt = fs.readFileSync(options.srchtml, 'utf-8')
//     targDir = path.dirname(options.destHtml);
//     if (!fs.existsSync(targDir)) {
//         fs.mkdirSync(targDir);
//     }
//     fs.writeFileSync(options.destHtml, inlineTemplate(txt));

//     // console.log(fs.readFileSync('lib/ngx-dateofcake.component.ts', 'utf-8'));

//     // log successful compilation to terminal
//     console.log(' ' + options.dest + ' built.');
// };

// // Expanded
// compileSass({
//     src : 'lib/ngx-dateofcake.component.scss',
//     dest: 'dist/example.css'
// });

// Minified
temStyLiner(conf);