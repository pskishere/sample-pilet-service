"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultProtocol = process.env.HTTPS ? 'https' : 'http';
exports.defaultPort = +(process.env.PORT || 9000);
exports.defaultPiletPath = `/api/v1/pilet`;
exports.defaultFilePath = '/files(/@:org)?/:name/:version/((*/)?:file)?';
//# sourceMappingURL=constants.js.map