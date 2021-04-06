/// <reference types="node" />
export interface AppOptions {
    piletPath?: string;
    filePath?: string;
    rootUrl?: string;
    apiKeys?: Array<string>;
    port?: number;
}
export declare function runApp({ filePath, piletPath, port, apiKeys, rootUrl, }?: AppOptions): import("http").Server;
