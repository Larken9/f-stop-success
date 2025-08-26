// userProgressType.ts - Add this to your sanity/schemaTypes folder
import { defineField, defineType } from "sanity";

export default defineType({
  name: "userProgress",
  title: "User Progress",
  type: "document",
  fields: [
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Firebase Auth User ID",
    }),
    defineField({
      name: "courseId",
      title: "Course",
      type: "reference",
      to: { type: "course" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "completedLessons",
      title: "Completed Lessons",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "lesson" },
        },
      ],
      description: "Array of lesson references that the user has completed",
    }),
    defineField({
      name: "currentModule",
      title: "Current Module",
      type: "reference",
      to: { type: "module" },
      description: "The module the user is currently working on",
    }),
    defineField({
      name: "overallProgress",
      title: "Overall Progress (%)",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 0,
    }),
    defineField({
      name: "lastAccessed",
      title: "Last Accessed",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "enrollmentDate",
      title: "Enrollment Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      userId: "userId",
      course: "courseId.title",
      progress: "overallProgress",
    },
    prepare(selection) {
      const { userId, course, progress } = selection;
      return {
        title: `${userId} - ${course || "Unknown Course"}`,
        subtitle: `Progress: ${progress || 0}%`,
      };
    },
  },
});

// Update your sanity/schemaTypes/index.ts to include this:
import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import courseType from "./courseType";
import moduleType from "./moduleType";
import lessonType from "./lessonType";
import { authorType } from "./authorType";
import userProgressType from "./userProgressType"; // Add this import

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    courseType,
    moduleType,
    lessonType,
    authorType,
    userProgressType, // Add this to the types array
  ],
};
