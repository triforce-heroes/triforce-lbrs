import { hash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { extract } from "@/Extract";
import { rebuildRaw } from "@/Rebuild";

describe("extract() function", () => {
  it("extract()", () => {
    const data = readFileSync("tests/fixtures/texts.lbrs");
    const { fileId, pathId, entries } = extract(data);

    expect({ fileId, pathId, entries }).toMatchSnapshot();

    const rebuilded = rebuildRaw(fileId, pathId, entries);

    writeFileSync("tests/fixtures/texts.lbrs.rebuilded", rebuilded);

    expect(hash("md5", rebuilded)).toStrictEqual(hash("md5", data));
  });
});
