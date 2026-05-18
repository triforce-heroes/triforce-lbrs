import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { rebuild, rebuildRaw } from "@/Rebuild.js";

import type { Entry } from "@/types/Entry";

import { extract } from "@/Extract";

describe("rebuildRaw() function", () => {
  type Test = [fileId: number, pathId: number, entries: Entry[]];

  const tests: Test[] = [
    [0, 1, []],
    [0, 2, [["HELLO", ["W", "O", "R", "L", "D", "", "!"]]]],
    [
      0,
      3,
      [
        ["A", ["B", "C"]],
        ["D", []],
      ],
    ],
    [0, 4, [["Hello", ["World!"]]]],
    [
      0,
      5,
      [
        ["Hello", ["World!"]],
        ["Hello", ["World!"]],
      ],
    ],
    [
      0,
      6,
      [
        ["ABCD", ["ABCD", "", "1234"]],
        ["123456", ["ABCD", "", "1234"]],
      ],
    ],
  ];

  it.each(tests)("[#%#] rebuildRaw(%j, %j, ...)", (fileId, pathId, entries) => {
    const rebuilded = rebuildRaw(fileId, pathId, entries);

    expect(rebuilded).toMatchSnapshot();
    expect(extract(rebuilded)).toStrictEqual({ fileId, pathId, entries });
  });
});

describe("rebuild() wrapper", () => {
  const data = readFileSync("tests/fixtures/texts.lbrs");
  const { entries: originalEntries } = extract(data);

  const targetName = originalEntries[0]![0];
  const targetTranslations = originalEntries[0]![1];

  it("empty map returns identical file", () => {
    const result = rebuild(data, new Map(), [0]);
    expect(extract(result)).toStrictEqual(extract(data));
  });

  it("modifies specific entry at specific index", () => {
    const result = rebuild(data, new Map([[targetName, "CHANGED"]]), [0]);
    const { entries } = extract(result);

    const modified = entries.find((entry) => entry[0] === targetName)!;
    expect(modified[1][0]).toBe("CHANGED");

    const expectedRest = [...targetTranslations];
    expectedRest[0] = "CHANGED";
    expect(modified[1]).toStrictEqual(expectedRest);
  });

  it("modifies specific entry at multiple indexes", () => {
    const result = rebuild(data, new Map([[targetName, "CHANGED"]]), [0, 1]);
    const { entries } = extract(result);

    const modified = entries.find((entry) => entry[0] === targetName)!;
    expect(modified[1][0]).toBe("CHANGED");
    expect(modified[1][1]).toBe("CHANGED");

    const expectedRest = [...targetTranslations];
    expectedRest[0] = "CHANGED";
    expectedRest[1] = "CHANGED";
    expect(modified[1]).toStrictEqual(expectedRest);
  });

  it("modifies multiple entries", () => {
    const secondName = originalEntries[1]![0];
    const map = new Map([
      [targetName, "FIRST"],
      [secondName, "SECOND"],
    ]);

    const result = rebuild(data, map, [0]);
    const { entries } = extract(result);

    const first = entries.find((entry) => entry[0] === targetName)!;

    expect(first[1][0]).toBe("FIRST");

    const second = entries.find((entry) => entry[0] === secondName)!;

    expect(second[1][0]).toBe("SECOND");
  });

  it("non-existent entry name is ignored", () => {
    const result = rebuild(data, new Map([["NONEXISTENT", "X"]]), [0]);
    expect(extract(result)).toStrictEqual(extract(data));
  });

  it("out-of-bounds index is ignored", () => {
    const result = rebuild(data, new Map([[targetName, "X"]]), [999]);
    expect(extract(result)).toStrictEqual(extract(data));
  });
});
