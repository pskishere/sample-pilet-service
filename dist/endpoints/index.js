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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const mime_types_1 = require("mime-types");
const pilets_1 = require("../pilets");
const db_1 = require("../db");
exports.getFiles = () => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, version, org, file, 2: directoryPath = '' } = req.params;
    const id = org ? `@${org}/${name}` : name;
    const pilet = yield db_1.getPilet(id, version);
    if (!pilet) {
        res.status(404).send('Pilet not found!');
    }
    else if (file) {
        const path = path_1.join(pilet.root, directoryPath, file)
            .split(path_1.sep)
            .join('/');
        const content = pilet.files[path];
        if (content) {
            const bufferContent = Buffer.from(pilet.files[path]);
            const tenYears = 24 * 60 * 60 * 365 * 10;
            res
                .header('Cache-Control', `public, max-age=${tenYears}`)
                .contentType(mime_types_1.lookup(file) || 'application/octet-stream')
                .status(200)
                .send(bufferContent);
        }
        else {
            if (file.indexOf('.') !== -1) {
                res.status(404).send('File not found!');
            }
            else {
                next();
            }
        }
    }
    else {
        const files = Object.keys(pilet.files)
            .map(m => path_1.relative(pilet.root, m))
            .filter(m => m.indexOf(path_1.sep) === -1);
        res.status(200).json({
            items: files,
        });
    }
});
exports.getLatestPilets = () => (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield pilets_1.latestPilets();
    return res.json({
        items: items.map((_a) => {
            var { author: _0, license: _1, description: _2 } = _a, item = __rest(_a, ["author", "license", "description"]);
            return item;
        }),
    });
});
exports.publishPilet = (rootUrl) => (req, res) => {
    const bb = req.busboy;
    if (bb) {
        req.pipe(bb);
        bb.on('file', (_, file) => pilets_1.storePilet(file, rootUrl)
            .then(() => res.status(200).json({
            success: true,
        }))
            .catch(err => {
            var _a;
            return res.status(((_a = err.message) === null || _a === void 0 ? void 0 : _a.indexOf('already exists')) !== -1 ? 409 : 400).json({
                success: false,
                message: err.message,
            });
        }));
    }
    else {
        res.status(400).json({
            success: false,
            message: 'Missing file upload.',
        });
    }
};
//# sourceMappingURL=index.js.map