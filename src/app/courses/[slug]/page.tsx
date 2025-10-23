// app/courses/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { courseBySlugQuery } from "../../lib/sanity-queries";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, BookOpen, Award } from "lucide-react";

interface CoursePageProps {
  params: { slug: string };
}

interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  price: number;
  duration: number;
  difficulty: string;
  category: string;
  targetAudience: string;
  learningOutcomes: string[];
  prerequisites?: string;
  featuredImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
    _type: string;
  };
  instructor?: {
    name: string;
    image?: {
      asset: {
        _ref: string;
        _type: string;
      };
      _type: string;
    };
    bio?: string;
  };
  modules: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    moduleNumber: number;
    description: string;
    estimatedDuration: number;
    lessons: Array<{
      _id: string;
      title: string;
      slug: { current: string };
      lessonNumber: number;
      estimatedDuration: number;
      difficulty: string;
    }>;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course: Course = await client.fetch(courseBySlugQuery, {
    slug: params.slug,
  });

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Course not found
          </h1>
          <Link href="/courses" className="text-blue-600 hover:underline">
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const totalDuration = course.modules.reduce(
    (acc, module) =>
      acc +
      module.lessons.reduce(
        (lessonAcc, lesson) => lessonAcc + (lesson.estimatedDuration || 0),
        0
      ),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-4">
                <Link
                  href="/courses"
                  className="text-blue-600 hover:underline text-sm"
                >
                  ← Back to courses
                </Link>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6">{course.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{Math.round(totalDuration / 60)} hours</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Award className="w-5 h-5 mr-2" />
                  <span>{course.difficulty}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{course.targetAudience}</span>
                </div>
              </div>

              {course.instructor && (
                <div className="flex items-center mb-6">
                  {course.instructor.image && (
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        src={urlFor(course.instructor.image)
                          .width(48)
                          .height(48)
                          .url()}
                        alt={course.instructor.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {course.instructor.name}
                    </div>
                    <div className="text-sm text-gray-600">Instructor</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-gray-900">
                  ${course.price}
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>

            <div>
              {course.featuredImage && (
                <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={urlFor(course.featuredImage)
                      .width(600)
                      .height(400)
                      .url()}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Learning Outcomes */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What You&apos;ll Learn
                </h2>
                <ul className="space-y-3">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-500 mr-3 mt-1">✓</span>
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Modules */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Course Content
              </h2>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div
                    key={module._id}
                    className="border border-gray-200 rounded-lg"
                  >
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {module.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {module.lessons.length} lessons •{" "}
                          {module.estimatedDuration}h
                        </span>
                      </div>
                      {module.description && (
                        <p className="text-gray-600 mt-2">
                          {module.description}
                        </p>
                      )}
                    </div>
                    <div className="p-4">
                      {module.lessons.map((lesson) => (
                        <Link
                          key={lesson._id}
                          href={`/courses/${course.slug.current}/lessons/${lesson.slug.current}`}
                          className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded transition-colors group"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {lesson.lessonNumber}
                            </div>
                            <span className="text-gray-900 group-hover:text-blue-600">
                              {lesson.title}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {lesson.estimatedDuration}min
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Details
              </h3>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Duration
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {course.duration} weeks
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Level</dt>
                  <dd className="text-sm text-gray-900">{course.difficulty}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Category
                  </dt>
                  <dd className="text-sm text-gray-900">{course.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Target Audience
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {course.targetAudience}
                  </dd>
                </div>
                {course.prerequisites && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Prerequisites
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {course.prerequisites}
                    </dd>
                  </div>
                )}
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors mt-6">
                Enroll for ${course.price}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
