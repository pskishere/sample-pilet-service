/// <reference types="qs" />
import { RequestHandler } from 'express';
export declare const checkAuth: (keys: string[], ...scopes: string[]) => RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
