import { Pilet } from '../types';
export declare function getPilets(): Promise<Array<Pilet>>;
export declare function getPilet(name: string, version: string): Promise<Pilet | undefined>;
export declare function setPilet(pilet: Pilet): Promise<void>;
