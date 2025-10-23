"use client";
import { useState, useEffect } from "react";
import { client } from "@/app/lib/sanity";
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EnrollmentGuard from "@/app/components/EnrollmentGuard";

interface LessonPageProps {
  params: {
    slug: string;
    lessonSlug: string;
  };
}

interface SanityBlock {
  _type: string;
  children?: Array<{
    _type: string;
    text: string;
  }>;
}

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
  lessonNumber: number;
  videoUrl?: string;
  estimatedDuration: number;
  difficulty: string;
  introduction?: SanityBlock[];
  whatYoullCover?: SanityBlock[];
  mainTeachingPoints?: SanityBlock[];
  reviewAndOutcome?: SanityBlock[];
  nextSteps?: SanityBlock[];
  actionTask?: {
    title: string;
    instructions: SanityBlock[];
    estimatedTime: number;
    isPersonalTask: boolean;
  };
  module: {
    _id: string;
    title: string;
    moduleNumber: number;
  };
  course: {
    _id: string;
    title: string;
    slug?: { current: string };
  };
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export default function LessonPage({ params }: LessonPageProps) {
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [nextLesson, setNextLesson] = useState<{slug: string, title: string} | null>(null);
  const [prevLesson, setPrevLesson] = useState<{slug: string, title: string} | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const setupAuthListener = async () => {
      const { auth } = await import("@/app/lib/firebase");
      const { onAuthStateChanged } = await import("firebase/auth");

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
      });

      return unsubscribe;
    };

    if (mounted) {
      setupAuthListener();
    }
  }, [mounted]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonQuery = `*[_type == "lesson" && slug.current == "${params.lessonSlug}"][0]{
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
          module->{
            _id,
            title,
            moduleNumber
          },
          course->{
            _id,
            title,
            slug
          }
        }`;

        const lessonData = await client.fetch(lessonQuery);

        if (!lessonData) {
          setError("Lesson not found");
          return;
        }

        setLesson(lessonData);

        // Fetch all lessons in the same course for navigation
        const allLessonsQuery = `*[_type == "lesson" && references("${lessonData.course._id}")] | order(module->moduleNumber asc, lessonNumber asc){
          _id,
          title,
          slug,
          lessonNumber,
          module->{
            moduleNumber
          }
        }`;

        const allLessons = await client.fetch(allLessonsQuery);
        
        // Find current lesson index
        const currentIndex = allLessons.findIndex((l: any) => l._id === lessonData._id);
        
        // Set next and previous lessons
        if (currentIndex > 0) {
          setPrevLesson({
            slug: allLessons[currentIndex - 1].slug.current,
            title: allLessons[currentIndex - 1].title
          });
        }
        
        if (currentIndex < allLessons.length - 1) {
          setNextLesson({
            slug: allLessons[currentIndex + 1].slug.current,
            title: allLessons[currentIndex + 1].title
          });
        }

      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [params.lessonSlug]);

  const markAsComplete = () => {
    setCompleted(true);
    // Here you would also update the user's progress in Sanity
  };

  const goToNextLesson = () => {
    if (nextLesson) {
      const courseSlug = lesson?.course.slug?.current || params.slug;
      router.push(`/courses/${courseSlug}/lessons/${nextLesson.slug}`);
    }
  };

  const goToPrevLesson = () => {
    if (prevLesson) {
      const courseSlug = lesson?.course.slug?.current || params.slug;
      router.push(`/courses/${courseSlug}/lessons/${prevLesson.slug}`);
    }
  };

  const renderRichText = (content: SanityBlock[]) => {
    if (!content || !Array.isArray(content)) return null;

    return content.map((block: SanityBlock, index: number) => {
      if (block._type === "block") {
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {block.children?.map((child) => child.text).join("")}
          </p>
        );
      }
      return null;
    });
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-4">Please sign in to access this lesson.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Lesson Not Found
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href={`/dashboard`} className="text-blue-600 hover:underline">
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EnrollmentGuard user={user} courseId={lesson.course._id}>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Course
              </Link>
              <div className="text-sm text-gray-500">
                Module {lesson.module.moduleNumber}: {lesson.module.title}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {lesson.estimatedDuration} min
              </div>
              <button
                onClick={markAsComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  completed
                    ? "bg-gray-100 text-gray-800 border border-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                {completed ? "Completed" : "Mark Complete"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Lesson Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                {lesson.lessonNumber}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {lesson.title}
                </h1>
                <p className="text-gray-600">Lesson {lesson.lessonNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {lesson.estimatedDuration} minutes
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {lesson.difficulty}
              </div>
              {lesson.videoUrl && (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Video included
                </div>
              )}
            </div>
          </div>

          {/* Video Section */}
          {lesson.videoUrl && (
            <div className="p-8 border-b border-gray-200">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-75" />
                  <p className="text-lg">Video Player</p>
                  <p className="text-sm opacity-75">URL: {lesson.videoUrl}</p>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Content */}
          <div className="p-8 space-y-8">
            {lesson.introduction && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Introduction
                </h2>
                <div className="prose max-w-none">
                  {renderRichText(lesson.introduction)}
                </div>
              </section>
            )}

            {lesson.whatYoullCover && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What You&apos;ll Cover
                </h2>
                <div className="prose max-w-none">
                  {renderRichText(lesson.whatYoullCover)}
                </div>
              </section>
            )}

            {lesson.mainTeachingPoints && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Main Teaching Points
                </h2>
                <div className="prose max-w-none">
                  {renderRichText(lesson.mainTeachingPoints)}
                </div>
              </section>
            )}

            {lesson.reviewAndOutcome && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Review and Outcome
                </h2>
                <div className="prose max-w-none">
                  {renderRichText(lesson.reviewAndOutcome)}
                </div>
              </section>
            )}

            {lesson.nextSteps && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Next Steps
                </h2>
                <div className="prose max-w-none">
                  {renderRichText(lesson.nextSteps)}
                </div>
              </section>
            )}

            {lesson.actionTask && (
              <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Action Task: {lesson.actionTask.title}
                </h2>
                <div className="prose max-w-none text-blue-800">
                  {renderRichText(lesson.actionTask.instructions)}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-blue-600">
                  <span>
                    Estimated time: {lesson.actionTask.estimatedTime} minutes
                  </span>
                  {lesson.actionTask.isPersonalTask && (
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      Personal Task
                    </span>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Navigation */}
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              {prevLesson ? (
                <button 
                  onClick={goToPrevLesson}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title={prevLesson.title}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm">Previous Lesson</div>
                    <div className="text-xs text-gray-500 max-w-48 truncate">
                      {prevLesson.title}
                    </div>
                  </div>
                </button>
              ) : (
                <div></div>
              )}
              
              {nextLesson ? (
                <button 
                  onClick={goToNextLesson}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  title={nextLesson.title}
                >
                  <div className="text-right">
                    <div className="text-sm">Next Lesson</div>
                    <div className="text-xs text-blue-100 max-w-48 truncate">
                      {nextLesson.title}
                    </div>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-gray-500">🎉 Course Complete!</div>
                  <Link 
                    href="/dashboard"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </EnrollmentGuard>
  );
}
