"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const responseTime = require("response-time");
const cors = require("cors");
const busboy = require("connect-busboy");
const auth_1 = require("./auth");
const resolvers_1 = require("./resolvers");
const middleware_1 = require("./middleware");
const endpoints_1 = require("./endpoints");
const constants_1 = require("./constants");
function getUrl(port) {
    const protocol = process.env.HTTP_X_FORWARDED_PROTO || constants_1.defaultProtocol;
    const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
    return `${protocol}://${host}`;
}
function runApp({ filePath = constants_1.defaultFilePath, piletPath = constants_1.defaultPiletPath, port = constants_1.defaultPort, apiKeys = auth_1.defaultKeys, rootUrl = getUrl(port), } = {}) {
    const app = express();
    app.use(cors({
        origin: '*',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(responseTime());
    app.use(busboy({
        highWaterMark: 2 * 1024 * 1024,
        limits: {
            fileSize: 32 * 1024 * 1024,
        },
    }));
    app.get(piletPath, endpoints_1.getLatestPilets());
    app.post(piletPath, middleware_1.checkAuth(apiKeys, 'publish-pilet'), endpoints_1.publishPilet(rootUrl));
    app.get(filePath, endpoints_1.getFiles());
    return resolvers_1.withGql(app).listen(port, () => {
        console.info(`Pilet feed fervice started on port ${port}.`);
        console.info(``);
        console.info(`  URL for uploading pilets:`);
        console.info(``);
        console.info(`    ${rootUrl}${piletPath}`);
        console.info(``);
        console.info(`  API keys for publishing:`);
        console.info(``);
        console.info(`    ${apiKeys.join('\n    ')}`);
        console.info(``);
    });
}
exports.runApp = runApp;
//# sourceMappingURL=app.js.map