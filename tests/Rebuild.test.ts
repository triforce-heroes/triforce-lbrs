import { describe, expect, it } from "vitest";

import { rebuild } from "@/Rebuild.js";

import type { Entry } from "@/types/Entry";

import { extract } from "@/Extract";

describe("rebuild() function", () => {
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

  it.each(tests)("[#%#] rebuild(%j, %j, ...)", (fileId, pathId, entries) => {
    const rebuilded = rebuild(fileId, pathId, entries);

    expect(rebuilded).toMatchSnapshot();
    expect(extract(rebuilded)).toStrictEqual({ fileId, pathId, entries });
  });
});
