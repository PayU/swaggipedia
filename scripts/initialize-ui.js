var fs = require('fs');

const { APP_BASE_NAME = '' } = process.env;
const PUBLIC_URL = `${APP_BASE_NAME}/ui`
const PUBLIC_URL_CONST = '@@@PUBLIC_URL@@@'
const PUBLIC_API_CONST = '@@@PUBLIC_API@@@'

const BUILD_PATH = './src/ui/build'
const INDEX_HTML_PATH = `${BUILD_PATH}/index.html`
const JS_FOLDER = `${BUILD_PATH}/static/js`
const CSS_FOLDER = `${BUILD_PATH}/static/css`

const JS_FILE_REGEX = /^main.(.*).js$/;
const CSS_FILE_REGEX = /^main.(.*).css$/;

const originalIndexHtml = fs.readFileSync(INDEX_HTML_PATH, { encoding: 'utf8', flag: 'r' });
const parsedIndexHtml = originalIndexHtml.replaceAll(PUBLIC_URL_CONST, PUBLIC_URL)
fs.writeFileSync(INDEX_HTML_PATH, parsedIndexHtml);
console.log(' (✓) index.html initialized successfully');

const jsFileName = fs.readdirSync(JS_FOLDER).find(file => JS_FILE_REGEX.test(file))
const jsFilePath = `${JS_FOLDER}/${jsFileName}`;
const originalJsFile = fs.readFileSync(jsFilePath, { encoding: 'utf8', flag: 'r' });
let parsedJsFile = originalJsFile.replaceAll(PUBLIC_URL_CONST, PUBLIC_URL)
parsedJsFile = parsedJsFile.replaceAll(PUBLIC_API_CONST, APP_BASE_NAME)
fs.writeFileSync(jsFilePath, parsedJsFile);
console.log(' (✓) js files initialized successfully');

const cssFileName = fs.readdirSync(CSS_FOLDER).find(file => CSS_FILE_REGEX.test(file))
const cssFilePath = `${CSS_FOLDER}/${cssFileName}`;
const originalCssFile = fs.readFileSync(cssFilePath, { encoding: 'utf8', flag: 'r' });
const parsedCssFile = originalCssFile.replaceAll(PUBLIC_URL_CONST, PUBLIC_URL)
fs.writeFileSync(cssFilePath, parsedCssFile);
console.log(' (✓) css files initialized successfully');