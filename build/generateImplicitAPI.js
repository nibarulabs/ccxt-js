import ccxt from '../js/ccxt.js';
import { promisify } from 'util';
import fs from 'fs';
import log from 'ololog'

const JS_PATH = './js/src/abstract/';
const TS_PATH = './ts/src/abstract/';
const PHP_PATH = './php/abstract/'
const ASYNC_PHP_PATH = './php/async/abstract/'
const CSHARP_PATH = './cs/ccxt/api/';
const PY_PATH = './python/ccxt/abstract/'
const IDEN = '    ';

const promisedWriteFile = promisify (fs.writeFile);
const promisedUnlinkFile = promisify (fs.unlink)

function isHttpMethod(method){
    return ['get', 'post', 'put', 'delete', 'patch'].includes (method);
}
//-------------------------------------------------------------------------

const capitalize = (s) => {
    return s.length ? (s.charAt (0).toUpperCase () + s.slice (1)) : s;
};

//-------------------------------------------------------------------------

function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

//-------------------------------------------------------------------------

function getPreamble () {
    return [
        "// -------------------------------------------------------------------------------",
        "",
        "// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:",
        "// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code",
        "",
        "// -------------------------------------------------------------------------------",
        "",
    ].join ("\n")
}

//-------------------------------------------------------------------------

function generateImplicitMethodNames(id, api, paths = []){
    const keys = Object.keys(api);
    for (const key of keys){
        let value = api[key];
        let endpoints = []
        if (isHttpMethod(key)){
            if (value && !Array.isArray(value)) {
                endpoints = Object.keys(value)
            } else {
                if  (Array.isArray(value)) {
                    endpoints = [];
                    for (const item of value){
                        if (Array.isArray(item)) {
                            endpoints.push(item[0])
                        } else {
                            endpoints.push(item)
                        }
                    }
                }
            }
            for (const endpoint of endpoints){
                const pattern = /[^a-zA-Z0-9]/g;
                const result = paths.concat (key).concat (endpoint.split (pattern)).filter(r => r.length > 0);
                let camelCasePath = result.map(capitalize).join('');
                camelCasePath = lowercaseFirstLetter(camelCasePath);
                storedCamelCaseMethods[id].push (camelCasePath)
                let underscorePath = result.map (x => x.toLowerCase ()).join ('_')
                storedUnderscoreMethods[id].push (underscorePath)
                let config = undefined
                if (Array.isArray (value)) {
                    config = {}
                } else {
                    config = value[endpoint]
                    if (typeof config === 'number') {
                        config = { 'cost': config }
                    }
                }
                const pyConfig = JSON.stringify (config).replace (/:/g, ': ').replace (/"/g, "'").replace (/,/g, ', ')
                const phpConfig = JSON.stringify (config).replace (/{/g, 'array(').replace (/:/g, ' => ').replace (/}/g, ')').replace (/,/g, ', ')
                storedContext[id].push ({
                    endpoint,
                    phpPath: paths.length === 1 ? `'${paths[0]}'` : 'array(' + paths.map (x => `'${x}'`).join (', ') + ')',
                    pyPath: paths.length === 1 ? `'${paths[0]}'` : '[' + paths.map (x => `'${x}'`).join (', ') + ']',
                    phpConfig: phpConfig,
                    pyConfig: pyConfig,
                    method: key.toUpperCase (),
                })
            }
        } else {
            generateImplicitMethodNames(id, value, paths.concat([ key ]))
        }
    }
}

//-------------------------------------------------------------------------

function createImplicitMethodsPyPhp(){
    const exchanges = Object.keys(storedCamelCaseMethods);
    for (const index in exchanges) {
        const exchange = exchanges[index];
        const camelCaseMethods = storedCamelCaseMethods[exchange];
        const underscoreMethods = storedUnderscoreMethods[exchange]

        const typeScriptMethods = camelCaseMethods.map (method => {
            return `${IDEN}${method} (params?: {}): Promise<implicitReturnType>;`
        });
        const phpMethods = underscoreMethods.concat (camelCaseMethods).map ((method, idx) => {
            const i = idx % underscoreMethods.length
            const context = storedContext[exchange][i]
            return `${IDEN}public function ${method}($params = array()) {
${IDEN}${IDEN}return $this->request('${context.endpoint}', ${context.phpPath}, '${context.method}', $params, null, null, ${context.phpConfig});
${IDEN}}`
        })
        const pythonMethods = underscoreMethods.map ((method, idx) => {
            const i = idx % underscoreMethods.length
            const camelCaseMethod = camelCaseMethods[i]
            const context = storedContext[exchange][i]
            return `${IDEN}${method} = ${camelCaseMethod} = Entry('${context.endpoint}', ${context.pyPath}, '${context.method}', ${context.pyConfig})`
        })
        typeScriptMethods.push ('}')
        phpMethods.push ('}')
        const footer = storedTypeScriptMethods[exchange].pop ()
        storedTypeScriptMethods[exchange] = storedTypeScriptMethods[exchange].concat (typeScriptMethods).concat ([ footer ])
        storedPhpMethods[exchange] = storedPhpMethods[exchange].concat (phpMethods)
        storedPyMethods[exchange] = storedPyMethods[exchange].concat (pythonMethods)
    }
}

// -------------------------------------------------------------------------

function createImplicitMethodsCSharp(){
    const exchanges = Object.keys(storedCamelCaseMethods);
    for (const index in exchanges) {
        const exchange = exchanges[index];
        const methodNames = storedCamelCaseMethods[exchange];

        const methods =  methodNames.map(method=> {
            return [
                `${IDEN}public async Task<object> ${method} (object parameters = null)`,
                `${IDEN}{`,
                `${IDEN}${IDEN}return await this.callAsync ("${method}",parameters);`,
                `${IDEN}}`,
                ``,
            ].join('\n')
        });
        methods.push ('}')
       storedCSharpMethods[exchange] = storedCSharpMethods[exchange].concat (methods)
    }
}

//-------------------------------------------------------------------------

async function editFiles (path, methods, extension) {
    const exchanges = Object.keys (storedCamelCaseMethods);
    const files = exchanges.map (ex => path + ex + extension)
    await Promise.all (files.map ((path, idx) => promisedWriteFile (path, methods[exchanges[idx]].join ('\n') + '\n')))
    await unlinkFiles (path, extension)
}

async function unlinkFiles (path, extension) {
    const exchanges = Object.keys (storedCamelCaseMethods);
    const abstract = fs.readdirSync (path)
    const ext = new RegExp (extension + '$')
    await Promise.all (abstract.filter (file => file !== '__init__.py' && file.match (ext) && !exchanges.includes (file.replace (ext, ''))).map (basename => promisedUnlinkFile (path + basename)))
}

// -------------------------------------------------------------------------

async function editAPIFilesCSharp(){
    const exchanges = Object.keys(storedCamelCaseMethods);
    const files = exchanges.map(ex => CSHARP_PATH + ex + '.cs');
    await Promise.all(files.map((path, idx) => promisedWriteFile(path, storedCSharpMethods[exchanges[idx]].join ('\n'))))
}

//-------------------------------------------------------------------------

function createTypescriptHeader(instance, parent){
    const exchange = instance.id;
    const importType = 'import { implicitReturnType } from \'../base/types.js\';'
    const importParent = (parent === 'Exchange') ?
        `import { Exchange as _Exchange } from '../base/Exchange.js';` :
        `import _${parent} from '../${parent}.js';`
    const typescriptHeader = `interface ${parent} {`
    const typescriptFooter = `abstract class ${parent} extends _${parent} {}\n\nexport default ${parent}` // hotswap later
    storedTypeScriptMethods[exchange] = [ getPreamble (), importType, importParent, '', typescriptHeader, typescriptFooter ];
}

//-------------------------------------------------------------------------

function createPhpHeader(instance, parent){
    const exchange = instance.id;
    const phpParent = (parent === 'Exchange') ? '\\ccxt\\Exchange' : '\\ccxt\\' + parent;
    const phpHeader = `abstract class ${instance.id} extends ${phpParent} {`
    const phpPreamble = `<?php

namespace ccxt\\abstract;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code
`
    storedPhpMethods[exchange] = [ phpPreamble, '', phpHeader ]
}

//-------------------------------------------------------------------------

function createPyHeader(instance, parent){
    const exchange = instance.id;
    const pyImports = 'from ccxt.base.types import Entry'
    const pyHeader = 'class ImplicitAPI:'
    storedPyMethods[exchange] = [ pyImports, '', '', pyHeader ]
}
// -------------------------------------------------------------------------

function createCSharpHeader(exchange, parent){
    const namespace = 'namespace ccxt;'
    const header = `public partial class ${exchange.id} : ${parent}\n{\n    public ${exchange.id} (object args = null): base(args) {}\n`;
    storedCSharpMethods[exchange.id] = [ getPreamble(), namespace, '', header];
}

//-------------------------------------------------------------------------

async function main() {
    log.bright.cyan ('Exporting TypeScript implicit api methods')
    const exchanges = ccxt.exchanges;
    for (const index in exchanges) {
        const exchange = exchanges[index];
        const exchangeClass = ccxt[exchange]
        const instance = new exchangeClass();
        let api = instance.api
        if (exchange in ccxt.pro) {
            const proInstance = new ccxt.pro[exchange] ()
            api = proInstance.api
        }
        const parent = Object.getPrototypeOf (Object.getPrototypeOf(instance)).constructor.name
        createTypescriptHeader(instance, parent);
        createPhpHeader(instance, parent);
        createCSharpHeader(instance, parent);
        createPyHeader(instance, parent);

        storedCamelCaseMethods[exchange] = []
        storedCamelCaseMethods[exchange] = []
        storedUnderscoreMethods[exchange] = []
        storedContext[exchange] = []

        generateImplicitMethodNames (exchange, api)
    }
    createImplicitMethodsPyPhp ()
    createImplicitMethodsCSharp()
    await editFiles (TS_PATH, storedTypeScriptMethods, '.ts');
    log.bright.cyan ('TypeScript implicit api methods completed!')
    await editFiles (PHP_PATH, storedPhpMethods, '.php');
    log.bright.cyan ('PHP sync implicit api methods completed!')
    // one more time for the async php
    Object.values (storedPhpMethods).forEach (x => {
        x[0] = x[0].replace (/ccxt\\abstract/, 'ccxt\\async\\abstract');
        x[2] = x[2].replace (/ccxt\\/, 'ccxt\\async\\')
    })
    await editFiles (ASYNC_PHP_PATH, storedPhpMethods, '.php');
    log.bright.cyan ('PHP async implicit api methods completed!')
    await editAPIFilesCSharp();
    log.bright.cyan ('Csharp implicit api methods completed!')

    await editFiles (PY_PATH, storedPyMethods, '.py');
    log.bright.cyan ('Python implicit api methods completed!')
    await unlinkFiles (JS_PATH, '.js')
    await unlinkFiles (JS_PATH, '.d.ts')
}
let storedCamelCaseMethods = {};
let storedUnderscoreMethods = {};
// let storedPhpResult = {};
let storedTypeScriptMethods = {};
let storedCSharpResult = {};
// let storedPyResult = {};
let storedCSharpMethods = {};
let storedContext = {};
let storedPhpMethods = {};
let storedPyMethods = {};
main()
