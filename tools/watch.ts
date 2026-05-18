import { readFileSync, writeFileSync } from "node:fs";

import { chunk } from "@triforce-heroes/triforce-core/Array";
import { generateQuery } from "@triforce-heroes/triforce-publisher";

import { extract } from "@/Extract";

const entries = new Map<string, Map<string, Set<string>>>();
const letters = new Set<number>();

const sourceEntries = extract(readFileSync(`tests/fixtures/texts.lbrs`));

function entryUpdate(name: string, message: string, language: string) {
  const entry = entries.getOrInsertComputed(name, () => new Map());
  const messages = entry.getOrInsertComputed(message, () => new Set());

  messages.add(language);

  for (const char of message) {
    letters.add(char.codePointAt(0)!);
  }
}

for (const [name, translations] of sourceEntries.entries) {
  entryUpdate(name, translations[0]!, "en-EU");
  entryUpdate(name, translations[1]!, "en");
  entryUpdate(name, translations[2]!, "fr");
  entryUpdate(name, translations[4]!, "de");
  entryUpdate(name, translations[5]!, "es");
  entryUpdate(name, translations[7]!, "it");
  entryUpdate(name, translations[8]!, "nl");
}

const processedEntries = [...entries.entries()].map(([reference, entry]) => ({
  resource: "",
  reference,
  sources: Object.fromEntries(
    [...entry.entries()].map(([message, messageLanguages]) => [message, [...messageLanguages]]),
  ),
}));

writeFileSync("entries.json", JSON.stringify(processedEntries, null, "\t"));

writeFileSync(
  "letters.json",
  JSON.stringify(
    [...letters].toSorted((letterA, letterB) => letterA - letterB),
    null,
    "\t",
  ),
);

writeFileSync(
  "uniques.json",
  JSON.stringify(
    [...new Set([...entries.values()].flatMap((entry) => [...entry.keys()]))],
    null,
    "\t",
  ),
);

const chunkEntries = chunk(processedEntries, 100);
const chunkDate = Date.now();

writeFileSync(
  "query.sql",

  chunkEntries.map((partialEntries) => generateQuery(6, partialEntries, chunkDate)!).join(";\n\n"),
);
