// lib/sanity-queries.ts
import { groq } from "next-sanity";

// Get all published courses
export const coursesQuery = groq`
  *[_type == "course" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
    price,
    duration,
    difficulty,
    category,
    targetAudience,
    learningOutcomes,
    featuredImage,
    instructor->{
      name,
      image,
      bio
    },
    _createdAt
  }
`;

// Get a single course with its modules and lessons
export const courseBySlugQuery = groq`
  *[_type == "course" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    description,
    price,
    duration,
    difficulty,
    category,
    targetAudience,
    learningOutcomes,
    prerequisites,
    featuredImage,
    instructor->{
      name,
      image,
      bio
    },
    _createdAt,
    "modules": *[_type == "module" && course._ref == ^._id && !(_id in path("drafts.**"))] | order(moduleNumber asc) {
      _id,
      title,
      slug,
      moduleNumber,
      description,
      estimatedDuration,
      objectives,
      "lessons": *[_type == "lesson" && module._ref == ^._id && !(_id in path("drafts.**"))] | order(lessonNumber asc) {
        _id,
        title,
        slug,
        lessonNumber,
        estimatedDuration,
        difficulty,
        featuredImage
      }
    }
  }
`;

// Get a single lesson with full content
export const lessonBySlugQuery = groq`
  *[_type == "lesson" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    lessonNumber,
    estimatedDuration,
    difficulty,
    introduction,
    whatYoullCover,
    mainTeachingPoints,
    reviewAndOutcome,
    nextSteps,
    actionTask,
    additionalResources,
    videoUrl,
    featuredImage,
    instructor->{
      name,
      image,
      bio
    },
    module->{
      _id,
      title,
      slug,
      moduleNumber,
      course->{
        _id,
        title,
        slug
      }
    },
    course->{
      _id,
      title,
      slug
    }
  }
`;

// Get module with its lessons
export const moduleBySlugQuery = groq`
  *[_type == "module" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    moduleNumber,
    description,
    estimatedDuration,
    objectives,
    featuredImage,
    course->{
      _id,
      title,
      slug
    },
    "lessons": *[_type == "lesson" && module._ref == ^._id && !(_id in path("drafts.**"))] | order(lessonNumber asc) {
      _id,
      title,
      slug,
      lessonNumber,
      estimatedDuration,
      difficulty,
      introduction,
      featuredImage
    }
  }
`;

// Get user progress for a specific course
export const userProgressQuery = groq`
  *[_type == "userProgress" && userId == $userId && courseId == $courseId][0] {
    _id,
    userId,
    courseId,
    completedLessons,
    currentModule,
    overallProgress,
    lastAccessed,
    enrollmentDate
  }
`;

// Get F-Stop to Success course specifically
export const fstopCourseQuery = groq`
  *[_type == "course" && title match "F-Stop*"][0]{
    _id,
    title,
    description,
    slug,
    instructor->{
      name,
      image
    },
    price,
    difficulty,
    category,
    featuredImage,
    "modules": *[_type == "module" && course._ref == ^._id] | order(moduleNumber asc) {
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
`;
