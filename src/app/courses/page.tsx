// app/courses/page.tsx
import { client } from "@/sanity/lib/client";
import { coursesQuery } from "@/app/lib/sanity-queries";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";

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
  featuredImage?: { asset: { _ref: string } };
  instructor?: {
    name: string;
    image?: { asset: { _ref: string } };
    bio?: string;
  };
}

export default async function CoursesPage() {
  const courses: Course[] = await client.fetch(coursesQuery);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Photography Courses for Mental Health Professionals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn phototherapy techniques to better support your clients,
            increase your income, and prevent burnout
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {course.featuredImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={urlFor(course.featuredImage)
                      .width(400)
                      .height(200)
                      .url()}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {course.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">
                    {course.duration} weeks
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>

                {course.instructor && (
                  <div className="flex items-center mb-4">
                    {course.instructor.image && (
                      <div className="relative w-8 h-8 mr-3">
                        <Image
                          src={urlFor(course.instructor.image)
                            .width(32)
                            .height(32)
                            .url()}
                          alt={course.instructor.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm text-gray-700">
                      by {course.instructor.name}
                    </span>
                  </div>
                )}

                {course.learningOutcomes &&
                  course.learningOutcomes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        You&apos;ll learn:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {course.learningOutcomes
                          .slice(0, 3)
                          .map((outcome, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-gray-500 mr-2">✓</span>
                              {outcome}
                            </li>
                          ))}
                        {course.learningOutcomes.length > 3 && (
                          <li className="text-gray-500 italic">
                            +{course.learningOutcomes.length - 3} more outcomes
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">
                    ${course.price}
                  </div>
                  <Link
                    href={`/courses/${course.slug?.current || ""}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses available yet
            </h3>
            <p className="text-gray-600">Check back soon for new courses!</p>
          </div>
        )}
      </div>
    </div>
  );
}
