// moduleType.ts - New schema for course modules
import { defineField, defineType } from "sanity";

export default defineType({
  name: "module",
  title: "Module",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Module Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      placeholder: "e.g., Module One: Overview",
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
      name: "course",
      title: "Course",
      type: "reference",
      to: { type: "course" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "moduleNumber",
      title: "Module Number",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
      description: "Order of this module within the course (1, 2, 3, etc.)",
    }),
    defineField({
      name: "description",
      title: "Module Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "estimatedDuration",
      title: "Estimated Duration (hours)",
      type: "number",
      initialValue: 3,
      description: "How many hours should students spend on this module?",
    }),
    defineField({
      name: "objectives",
      title: "Learning Objectives",
      type: "array",
      of: [{ type: "string" }],
      description: "What will students learn in this module?",
    }),
    defineField({
      name: "featuredImage",
      title: "Module Image",
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
  ],
  preview: {
    select: {
      title: "title",
      course: "course.title",
      moduleNumber: "moduleNumber",
      media: "featuredImage",
    },
    prepare(selection) {
      const { course, moduleNumber } = selection;
      return {
        ...selection,
        subtitle: `${course ? `${course} • ` : ""}Module ${moduleNumber || "?"}`,
      };
    },
  },
  orderings: [
    {
      title: "Module Number",
      name: "moduleNumberAsc",
      by: [{ field: "moduleNumber", direction: "asc" }],
    },
  ],
});
