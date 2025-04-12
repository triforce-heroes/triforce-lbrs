import { BufferBuilder } from "@triforce-heroes/triforce-core/BufferBuilder";

import type { Entry } from "@/types/Entry";

export function rebuild(fileId: number, pathId: number, entries: Entry[]) {
  const builder = new BufferBuilder();

  // Header #1.
  builder.writeUnsignedInt32(0);
  builder.writeUnsignedInt32(0);
  builder.writeUnsignedInt32(0);
  builder.writeUnsignedInt32(1);

  // Header #2.
  builder.writeUnsignedInt32(fileId);
  builder.writeUnsignedInt32(pathId);
  builder.writeUnsignedInt32(0);
  builder.writeLengthPrefixedString("texts_db");

  // Entries.
  builder.writeUnsignedInt32(entries.length);

  for (const [name, translations] of entries) {
    builder.writeLengthPrefixedString(name);
    builder.pad(4);

    builder.writeUnsignedInt32(translations.length);

    for (const translation of translations) {
      builder.writeLengthPrefixedString(translation);
      builder.pad(4);
    }
  }

  return builder.build();
}
