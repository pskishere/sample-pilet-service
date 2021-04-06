/// <reference types="node" />
export declare function latestPilets(): Promise<({
    name: string;
    description: string;
    author: {
        name: string;
        email: string;
    };
    license: {
        type: string;
        text: string;
    };
    version: string;
    link: string;
    content: string;
    hash: string;
    noCache: string | boolean;
    custom: any;
    requireRef?: undefined;
    integrity?: undefined;
} | {
    name: string;
    description: string;
    author: {
        name: string;
        email: string;
    };
    license: {
        type: string;
        text: string;
    };
    version: string;
    link: string;
    requireRef: string;
    integrity: string;
    custom: any;
    content?: undefined;
    hash?: undefined;
    noCache?: undefined;
})[]>;
export declare function storePilet(file: NodeJS.ReadableStream, rootUrl: string): Promise<void>;
