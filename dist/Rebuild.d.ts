import type { Entry } from "./types/Entry";
export declare function rebuildRaw(fileId: number, pathId: number, entries: Entry[]): Buffer<ArrayBuffer>;
export declare function rebuild(data: Buffer, entries: Map<string, string>, indexes: number[]): Buffer<ArrayBuffer>;
