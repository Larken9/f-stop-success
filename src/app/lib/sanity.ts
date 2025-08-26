// lib/sanity.ts
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  apiVersion: "2023-05-03",
  token: process.env.SANITY_API_TOKEN, // Only if you want to update content with the client
});

// Create a separate client for write operations with explicit token
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2023-05-03",
  token: process.env.SANITY_API_TOKEN!,
  ignoreBrowserTokenWarning: true, // Suppress warnings in development
});

// Helper functions for common queries based on your schema structure
export const courseQueries = {
  // Get the F-Stop to Success course with all modules and lessons
  getFStopCourse: () => `
    *[_type == "course" && slug.current == "fstop-to-success"][0]{
      _id,
      title,
      description,
      slug,
      instructor->{
        name,
        image,
        bio
      },
      price,
      difficulty,
      category,
      featuredImage,
      "modules": *[_type == "module" && course._ref == ^._id && isPublished == true] | order(moduleNumber asc) {
        _id,
        title,
        description,
        slug,
        moduleNumber,
        estimatedDuration,
        objectives,
        featuredImage,
        "lessons": *[_type == "lesson" && module._ref == ^._id && isPublished == true] | order(lessonNumber asc) {
          _id,
          title,
          slug,
          lessonNumber,
          videoUrl,
          estimatedDuration,
          difficulty,
          introduction,
          whatYoullCover,
          mainTeachingPoints,
          reviewAndOutcome,
          nextSteps,
          actionTask,
          additionalResources,
          featuredImage,
          isPublished
        }
      }
    }
  `,

  // Get user progress for a specific user and course
  getUserProgress: (userId: string, courseId: string) => `
    *[_type == "userProgress" && userId == "${userId}" && courseId == "${courseId}"][0]{
      _id,
      userId,
      courseId,
      completedLessons,
      currentModule,
      overallProgress,
      lastAccessed,
      enrollmentDate
    }
  `,

  // Get specific module with lessons
  getModule: (moduleId: string) => `
    *[_type == "module" && _id == "${moduleId}"][0]{
      _id,
      title,
      description,
      slug,
      moduleNumber,
      estimatedDuration,
      objectives,
      featuredImage,
      "lessons": *[_type == "lesson" && module._ref == ^._id && isPublished == true] | order(lessonNumber asc) {
        _id,
        title,
        slug,
        lessonNumber,
        videoUrl,
        estimatedDuration,
        difficulty,
        introduction,
        whatYoullCover,
        mainTeachingPoints,
        reviewAndOutcome,
        nextSteps,
        actionTask,
        additionalResources,
        featuredImage
      }
    }
  `,

  // Get specific lesson with full content
  getLesson: (lessonId: string) => `
    *[_type == "lesson" && _id == "${lessonId}"][0]{
      _id,
      title,
      slug,
      lessonNumber,
      videoUrl,
      estimatedDuration,
      difficulty,
      introduction,
      whatYoullCover,
      mainTeachingPoints,
      reviewAndOutcome,
      nextSteps,
      actionTask,
      additionalResources,
      featuredImage,
      module->{
        _id,
        title,
        moduleNumber
      },
      course->{
        _id,
        title
      },
      instructor->{
        name,
        image
      }
    }
  `,
};

// Helper functions for mutations
export const courseMutations = {
  // Create user progress
  createUserProgress: async (
    userId: string,
    courseId: string,
    firstModuleId?: string
  ) => {
    return await writeClient.create({
      _type: "userProgress",
      userId,
      courseId,
      completedLessons: [],
      currentModule: firstModuleId || undefined,
      overallProgress: 0,
      lastAccessed: new Date().toISOString(),
      enrollmentDate: new Date().toISOString(),
    });
  },

  // Update user progress
  updateUserProgress: async (
    progressId: string,
    updates: Partial<{
      completedLessons: string[];
      currentModule: string;
      overallProgress: number;
      lastAccessed: string;
    }>
  ) => {
    return await writeClient
      .patch(progressId)
      .set({
        ...updates,
        lastAccessed: new Date().toISOString(),
      })
      .commit();
  },

  // Mark lesson as complete
  markLessonComplete: async (
    progressId: string,
    lessonId: string,
    currentCompletedLessons: string[],
    totalLessons: number
  ) => {
    const updatedCompletedLessons = [...currentCompletedLessons, lessonId];
    const newProgress = Math.round(
      (updatedCompletedLessons.length / totalLessons) * 100
    );

    return await writeClient
      .patch(progressId)
      .set({
        completedLessons: updatedCompletedLessons,
        overallProgress: newProgress,
        lastAccessed: new Date().toISOString(),
      })
      .commit();
  },

  // Update current module
  updateCurrentModule: async (progressId: string, moduleId: string) => {
    return await writeClient
      .patch(progressId)
      .set({
        currentModule: moduleId,
        lastAccessed: new Date().toISOString(),
      })
      .commit();
  },
};

// Utility function to convert Sanity image URLs
export const urlFor = (source: { asset: { _ref: string } } | null | undefined): string | null => {
  if (!source?.asset?._ref) return null;

  const [, id, dimensions, format] = source.asset._ref.split("-");

  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}-${dimensions}.${format}`;
};
