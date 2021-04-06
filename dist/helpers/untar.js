"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tar = require("tar");
const zlib_1 = require("zlib");
const TarParser = tar.Parse;
function untar(stream) {
    return new Promise((resolve, reject) => {
        const files = {};
        stream
            .on('error', reject)
            .pipe(zlib_1.createGunzip())
            .on('error', reject)
            .pipe(new TarParser())
            .on('error', reject)
            .on('entry', (e) => {
            const content = [];
            const p = e.path;
            e.on('error', reject);
            e.on('data', (c) => content.push(c));
            // e.on('end', () => (files[p] = Buffer.concat(content)));
            e.on('end', () => (files[p] = Buffer.concat(content).toString('utf8')));
        })
            .on('end', () => resolve(files));
    });
}
exports.untar = untar;
//# sourceMappingURL=untar.js.map