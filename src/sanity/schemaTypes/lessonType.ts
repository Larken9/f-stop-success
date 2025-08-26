// lessonType.ts - Enhanced for your structured lessons with Introduction, Main Points, etc.
import { defineField, defineType } from "sanity";

export default defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Lesson Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      placeholder: "e.g., Learning Lesson One: Welcome",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "module",
      title: "Module",
      type: "reference",
      to: { type: "module" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "course",
      title: "Course",
      type: "reference",
      to: { type: "course" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lessonNumber",
      title: "Lesson Number",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
      description: "Order of this lesson within the module",
    }),
    defineField({
      name: "instructor",
      title: "Instructor",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Link to the lesson video (YouTube, Vimeo, etc.)",
    }),
    defineField({
      name: "estimatedDuration",
      title: "Estimated Duration (minutes)",
      type: "number",
      initialValue: 30,
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty Level",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
      },
    }),

    // Structured Content Fields based on your format
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "blockContent",
      description: "Opening section that welcomes students and sets context",
    }),
    defineField({
      name: "whatYoullCover",
      title: "What You'll Cover & Why It's Important",
      type: "blockContent",
      description: "Overview of lesson content and its importance",
    }),
    defineField({
      name: "mainTeachingPoints",
      title: "Main Teaching Points with Supporting Points",
      type: "blockContent",
      description: "Core lesson content with detailed explanations",
    }),
    defineField({
      name: "reviewAndOutcome",
      title: "Review and Outcome",
      type: "blockContent",
      description: "Summary of what was learned and expected outcomes",
    }),
    defineField({
      name: "nextSteps",
      title: "Next Steps",
      type: "blockContent",
      description: "Transition to next lesson or action items",
    }),
    defineField({
      name: "actionTask",
      title: "Action Task",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Task Title",
          type: "string",
        },
        {
          name: "instructions",
          title: "Task Instructions",
          type: "blockContent",
        },
        {
          name: "estimatedTime",
          title: "Estimated Time (minutes)",
          type: "number",
        },
        {
          name: "isPersonalTask",
          title: "Personal Development Task",
          type: "boolean",
          description:
            "Is this task for personal growth vs. client application?",
        },
      ],
    }),
    defineField({
      name: "additionalResources",
      title: "Additional Resources",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Resource Title" },
            { name: "url", type: "url", title: "Resource URL" },
            { name: "description", type: "text", title: "Description" },
          ],
        },
      ],
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      module: "module.title",
      lessonNumber: "lessonNumber",
      media: "featuredImage",
    },
    prepare(selection) {
      const { module, lessonNumber } = selection;
      return {
        ...selection,
        subtitle: `${module ? `${module} • ` : ""}Lesson ${lessonNumber || "?"}`,
      };
    },
  },
  orderings: [
    {
      title: "Lesson Number",
      name: "lessonNumberAsc",
      by: [{ field: "lessonNumber", direction: "asc" }],
    },
  ],
});
