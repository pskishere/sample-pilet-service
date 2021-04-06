"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const helpers_1 = require("../helpers");
function getPilet(pilet) {
    switch (pilet.type) {
        case 'v0':
            return {
                name: pilet.name,
                description: pilet.description,
                author: pilet.author,
                license: pilet.license,
                version: pilet.version,
                link: pilet.link,
                content: pilet.content,
                hash: pilet.hash,
                noCache: pilet.noCache,
                custom: pilet.custom,
            };
        case 'v1':
            return {
                name: pilet.name,
                description: pilet.description,
                author: pilet.author,
                license: pilet.license,
                version: pilet.version,
                link: pilet.link,
                requireRef: pilet.requireRef,
                integrity: pilet.integrity,
                custom: pilet.custom,
            };
        default:
            return pilet;
    }
}
function latestPilets() {
    return __awaiter(this, void 0, void 0, function* () {
        const pilets = yield db_1.getPilets();
        const unique = pilets.reduce((prev, curr) => {
            prev[curr.meta.name] = curr.meta;
            return prev;
        }, {});
        return Object.keys(unique)
            .map(name => unique[name])
            .map(getPilet);
    });
}
exports.latestPilets = latestPilets;
function storePilet(file, rootUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const pilet = yield helpers_1.getPiletDefinition(file, rootUrl);
        // const { name, version } = pilet.meta;
        // const exists = await getPilets().then(m => m.some(m => m.meta.name === name && m.meta.version === version));
        // if (exists) {
        //   throw new Error(`A pilet with name "${name}" and version "${version}" already exists.`);
        // }
        yield db_1.setPilet(pilet);
    });
}
exports.storePilet = storePilet;
//# sourceMappingURL=index.js.map