// Updated sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import courseType from "./courseType";
import moduleType from "./moduleType"; // New module schema
import lessonType from "./lessonType";
import { authorType } from "./authorType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, courseType, moduleType, lessonType, authorType],
};
