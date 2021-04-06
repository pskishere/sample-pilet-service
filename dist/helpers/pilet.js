"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const author_1 = require("./author");
const untar_1 = require("./untar");
const hash_1 = require("./hash");
const packageRoot = 'package/';
const extractRequireRef = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
let iter = 1;
function getPackageJson(files) {
    const fileName = `${packageRoot}package.json`;
    const fileContent = files[fileName];
    // const content = fileContent.toString('utf8');
    const content = fileContent;
    return JSON.parse(content);
}
function getContent(path, files) {
    const content = path && files[path];
    return content;
    // return content && content.toString('utf8');
}
function getPiletMainPath(data, files) {
    const paths = [
        data.main,
        `dist/${data.main}`,
        `${data.main}/index.js`,
        `dist/${data.main}/index.js`,
        'index.js',
        'dist/index.js',
    ];
    return paths.map(filePath => `${packageRoot}${filePath}`).filter(filePath => !!files[filePath])[0];
}
function extractPiletMetadata(data, main, file, files, rootUrl) {
    const name = data.name;
    const version = data.preview ? `${data.version}-pre.${iter++}` : data.version;
    const [, requireRef] = extractRequireRef.exec(main || '') || [];
    const author = author_1.formatAuthor(data.author);
    const license = {
        type: data.license || 'ISC',
        text: getContent(`${packageRoot}LICENSE`, files) || '',
    };
    if (requireRef) {
        return {
            name,
            version,
            requireRef,
            description: data.description,
            custom: data.custom,
            author,
            integrity: hash_1.computeIntegrity(main),
            link: `${rootUrl}/files/${name}/${version}/${file}`,
            type: 'v1',
            license,
        };
    }
    else {
        return {
            name,
            version,
            description: data.description,
            custom: data.custom,
            author,
            hash: hash_1.computeHash(main),
            link: `${rootUrl}/files/${name}/${version}/${file}`,
            type: 'v0',
            license,
        };
    }
}
exports.extractPiletMetadata = extractPiletMetadata;
function getPiletDefinition(stream, rootUrl) {
    return untar_1.untar(stream).then(files => {
        const data = getPackageJson(files);
        const path = getPiletMainPath(data, files);
        const root = path_1.dirname(path);
        const file = path_1.basename(path);
        const main = getContent(path, files);
        const meta = extractPiletMetadata(data, main, file, files, rootUrl);
        return {
            meta,
            root,
            files,
        };
    });
}
exports.getPiletDefinition = getPiletDefinition;
//# sourceMappingURL=pilet.js.map