/// <reference types="node" />
import { PiletMetadata, PackageData, PackageFiles, Pilet } from '../types';
export declare function extractPiletMetadata(data: PackageData, main: string, file: string, files: PackageFiles, rootUrl: string): PiletMetadata;
export declare function getPiletDefinition(stream: NodeJS.ReadableStream, rootUrl: string): Promise<Pilet>;
