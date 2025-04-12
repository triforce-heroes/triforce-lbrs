import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

import type { Entry } from "@/types/Entry";

export function extract(data: Buffer) {
  const consumer = new BufferConsumer(data, 16);

  const fileId = consumer.readUnsignedInt32();
  const pathId = consumer.readUnsignedInt32();

  const entries: Entry[] = [];
  const entriesCount = consumer.skip(16).readUnsignedInt32();

  for (let i = 0; i < entriesCount; i++) {
    const name = consumer.readLengthPrefixedString();

    const translationsCount = consumer.skipPadding(4).readUnsignedInt32();
    const translations: string[] = [];

    for (let j = 0; j < translationsCount; j++) {
      translations.push(consumer.readLengthPrefixedString());
      consumer.skipPadding(4);
    }

    entries.push([name, translations]);
  }

  return { fileId, pathId, entries };
}
