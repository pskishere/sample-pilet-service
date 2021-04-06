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
const redis = require('redis');
const BSON = require('bson');
const client = redis.createClient({
    host: process.env.REDIS_HOST || '0.0.0.0',
    port: process.env.REDIS_PORT || 6379,
    url: process.env.REDIS_URL || null,
    return_buffers: true,
});
// let piletData: Record<string, Record<string, Pilet>> = {};
function getPilets() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            client.keys('*', function (err, replies) {
                return __awaiter(this, void 0, void 0, function* () {
                    const names = replies.toString('utf-8').split(',');
                    let namesPromise = [];
                    names.forEach((element) => {
                        if (element != '') {
                            namesPromise.push(new Promise(resolve => {
                                client.get(element, function (err, reply) {
                                    const pilet = BSON.deserialize(reply);
                                    Object.keys(pilet).forEach((version) => {
                                        resolve(pilet[version]);
                                    });
                                });
                            }));
                        }
                    });
                    return Promise.all(namesPromise).then(promises => {
                        resolve(promises);
                    });
                });
            });
        });
    });
}
exports.getPilets = getPilets;
function getPilet(name, version) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            client.get(name, function (err, reply) {
                const pilet = BSON.deserialize(reply);
                Object.keys(pilet).forEach((version) => {
                    resolve(pilet[version]);
                });
            });
        }).then((res) => {
            return res;
        });
    });
}
exports.getPilet = getPilet;
function setPilet(pilet) {
    return __awaiter(this, void 0, void 0, function* () {
        const meta = pilet.meta;
        const current = BSON.serialize(Object.assign({}, { [meta.version]: pilet }));
        client.set(meta.name, current, function (err, res) {
            if (!err) {
                console.log(`${meta.name} was uploaded successfully !`);
            }
            else {
                console.log(`${meta.name} failed to upload !`);
            }
        });
    });
}
exports.setPilet = setPilet;
//# sourceMappingURL=index.js.map