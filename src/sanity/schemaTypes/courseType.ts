import { defineField, defineType } from "sanity";

export default defineType({
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Course Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "description",
      title: "Course Description",
      type: "text",
    }),
    defineField({
      name: "instructor",
      title: "Instructor",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
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
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Portrait Photography", value: "portrait" },
          { title: "Landscape Photography", value: "landscape" },
          { title: "Technical Fundamentals", value: "technical" },
          { title: "Post-Processing", value: "editing" },
          { title: "Studio Photography", value: "studio" },
        ],
      },
    }),
    defineField({
      name: "featuredImage",
      title: "Course Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
  ],
});
