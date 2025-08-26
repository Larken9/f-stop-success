// Updated sanity/structure.ts
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("F-STOP to Success LMS")
    .items([
      // Courses section
      S.documentTypeListItem("course").title("Courses"),

      // Modules section
      S.listItem()
        .title("Modules")
        .child(
          S.documentTypeList("module")
            .title("Modules")
            .defaultOrdering([{ field: "moduleNumber", direction: "asc" }])
        ),

      // Lessons section
      S.listItem()
        .title("Lessons")
        .child(
          S.documentTypeList("lesson")
            .title("Lessons")
            .defaultOrdering([{ field: "lessonNumber", direction: "asc" }])
        ),

      // Instructors section
      S.documentTypeListItem("author").title("Instructors"),

      S.divider(),

      // Other document types
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["course", "module", "lesson", "author"].includes(item.getId()!)
      ),
    ]);
