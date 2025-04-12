import type { Entry } from "./types/Entry";
export declare function extract(data: Buffer): {
    fileId: number;
    pathId: number;
    entries: Entry[];
};
