"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function computeHash(content) {
    const sha1sum = crypto_1.createHash('sha1');
    sha1sum.update(content || '');
    return sha1sum.digest('hex');
}
exports.computeHash = computeHash;
function computeIntegrity(content) {
    const sum = crypto_1.createHash('sha256');
    sum.update(content || '');
    return `sha256-${sum.digest('base64')}`;
}
exports.computeIntegrity = computeIntegrity;
//# sourceMappingURL=hash.js.map