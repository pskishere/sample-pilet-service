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
const authHeaderExtract = /^basic\s+([a-fA-F0-9]+)$/i;
function checkKey(authHeader, keys, scopes) {
    const result = authHeaderExtract.exec(authHeader);
    return result && keys.includes(result[1]);
}
exports.checkAuth = (keys, ...scopes) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorized = yield checkKey(req.headers.authorization, keys, scopes);
    if (!authorized) {
        res.status(401).json({
            success: false,
            message: 'Invalid API key supplied.',
        });
    }
    else {
        next();
    }
});
//# sourceMappingURL=index.js.map