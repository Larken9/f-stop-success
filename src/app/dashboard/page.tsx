"use client";
import { useState, useEffect } from "react";
import { Camera, LogOut, CheckCircle, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { client } from "../lib/sanity";
import { courseQueries, courseMutations } from "../lib/sanity";
import EnrollmentGuard from "../components/EnrollmentGuard";

// Define types matching your Sanity schemas
interface SanityImage {
  asset: {
    _ref: string;
    _type: string;
  };
  _type: string;
}

interface SanityRichText {
  _type: string;
  children: Array<{
    _type: string;
    text: string;
  }>;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  slug: { current: string };
  instructor: {
    name: string;
    image?: SanityImage;
  };
  price: number;
  difficulty: string;
  category: string;
  featuredImage?: SanityImage;
  modules: Module[];
}

interface Module {
  _id: string;
  title: string;
  description: string;
  slug: { current: string };
  moduleNumber: number;
  estimatedDuration: number;
  objectives: string[];
  featuredImage?: SanityImage;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
  lessonNumber: number;
  videoUrl?: string;
  estimatedDuration: number;
  difficulty: string;
  introduction?: SanityRichText;
  whatYoullCover?: SanityRichText;
  mainTeachingPoints?: SanityRichText;
  reviewAndOutcome?: SanityRichText;
  nextSteps?: SanityRichText;
  actionTask?: {
    title: string;
    instructions: SanityRichText;
    estimatedTime: number;
    isPersonalTask: boolean;
  };
  additionalResources?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  featuredImage?: SanityImage;
  isPublished: boolean;
}

interface UserProgress {
  _id?: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentModule: string;
  overallProgress: number;
  lastAccessed: string;
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      const { auth } = await import("../lib/firebase");
      const { signOut } = await import("firebase/auth");

      await signOut(auth);
      setUser(null);
      setCourse(null);
      setUserProgress(null);
      setSelectedModule(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const setupAuthListener = async () => {
      const { auth } = await import("../lib/firebase");
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
          setLoading(false);
        }
      });

      return unsubscribe;
    };

    if (mounted) {
      setupAuthListener();
    }
  }, [mounted]);

  // Fetch course data and user progress from Sanity
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First, let's test basic Sanity connection
        console.log("Testing Sanity connection...");
        const testQuery = '*[_type == "course"]';
        const allCourses = await client.fetch(testQuery);
        console.log("All courses found:", allCourses);

        // Fetch the F-Stop to Success course with modules and lessons
        const courseQuery = courseQueries.getFStopCourse();
        const courseData = await client.fetch(courseQuery);
        console.log("F-Stop course data:", courseData);

        if (!courseData) {
          setError(
            "F-Stop to Success course not found. Please contact support."
          );
          setLoading(false);
          return;
        }

        setCourse(courseData);

        // Fetch or create user progress
        const progressQuery = courseQueries.getUserProgress(
          user.uid,
          courseData._id
        );
        const progressData = await client.fetch(progressQuery);
        console.log("Progress data:", progressData);

        if (!progressData) {
          // If we can't create progress due to permissions, use local state
          console.log("No existing progress found, using local state for now");
          const localProgress: UserProgress = {
            userId: user.uid,
            courseId: courseData._id,
            completedLessons: [],
            currentModule: courseData.modules[0]?._id || "",
            overallProgress: 0,
            lastAccessed: new Date().toISOString(),
          };
          setUserProgress(localProgress);
        } else {
          setUserProgress(progressData as unknown as UserProgress);
        }
      } catch (err) {
        console.error("Detailed error fetching course data:", err);
        setError(
          `Failed to load course content: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    if (mounted && user) {
      fetchCourseData();
    }
  }, [user, mounted]);

  if (!mounted) {
    return null;
  }

  // Function to mark lesson as complete
  const markLessonComplete = async (lessonId: string) => {
    if (!userProgress || !course) return;

    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );

    try {
      // Check if we have a valid database ID before trying to update Sanity
      if (userProgress._id && userProgress._id.length > 0) {
        const updatedProgress = await courseMutations.markLessonComplete(
          userProgress._id,
          lessonId,
          userProgress.completedLessons,
          totalLessons
        );
        setUserProgress(updatedProgress as unknown as UserProgress);
        console.log("Successfully updated progress in database");
      } else {
        // Update local state only (no database permissions)
        const updatedCompletedLessons = [
          ...userProgress.completedLessons,
          lessonId,
        ];
        const newProgress = Math.round(
          (updatedCompletedLessons.length / totalLessons) * 100
        );

        setUserProgress({
          ...userProgress,
          completedLessons: updatedCompletedLessons,
          overallProgress: newProgress,
          lastAccessed: new Date().toISOString(),
        });
        console.log("Updated progress locally (no database ID available)");
      }
    } catch (err) {
      console.error("Error updating progress:", err);
      // Fallback to local state update
      const updatedCompletedLessons = [
        ...userProgress.completedLessons,
        lessonId,
      ];
      const newProgress = Math.round(
        (updatedCompletedLessons.length / totalLessons) * 100
      );

      setUserProgress({
        ...userProgress,
        completedLessons: updatedCompletedLessons,
        overallProgress: newProgress,
        lastAccessed: new Date().toISOString(),
      });
      console.log("Fell back to local progress update due to error");
    }
  };

  // Function to update current module
  const updateCurrentModule = async (moduleId: string) => {
    if (!userProgress) return;

    try {
      // Check if we have a valid database ID before trying to update Sanity
      if (userProgress._id && userProgress._id.length > 0) {
        const updatedProgress = await courseMutations.updateCurrentModule(
          userProgress._id,
          moduleId
        );
        setUserProgress(updatedProgress as unknown as UserProgress);
        console.log("Successfully updated current module in database");
      } else {
        // Update local state only (no database permissions)
        setUserProgress({
          ...userProgress,
          currentModule: moduleId,
          lastAccessed: new Date().toISOString(),
        });
        console.log(
          "Updated current module locally (no database ID available)"
        );
      }
    } catch (err) {
      console.error("Error updating current module:", err);
      // Fallback to local state update
      setUserProgress({
        ...userProgress,
        currentModule: moduleId,
        lastAccessed: new Date().toISOString(),
      });
      console.log("Fell back to local current module update due to error");
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen" style={{backgroundColor: '#FAFAFA'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#1a1a1a'}}></div>
          <p style={{color: '#666666', fontFamily: 'Inter, sans-serif'}}>Loading your course...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-24 pb-16" style={{backgroundColor: '#FAFAFA', minHeight: '100vh'}}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-10" 
               style={{backgroundColor: '#FFFFFF', 
                       boxShadow: '0 20px 40px rgba(0, 48, 39, 0.1)', 
                       border: '1px solid rgba(0, 48, 39, 0.05)'}}>
            <div className="text-center mb-8">
              <Camera className="h-12 w-12 mx-auto mb-4" style={{color: '#1a1a1a'}} />
              <h1 className="text-3xl font-light mb-4" 
                  style={{fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a'}}>
                Access Your Dashboard
              </h1>
              <p style={{color: '#666666', fontFamily: 'Inter, sans-serif'}}>
                Please sign in to access your learning dashboard
              </p>
            </div>

            <Link
              href="/"
              className="w-full text-white py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)', fontFamily: 'Inter, sans-serif'}}
            >
              <Camera className="h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16" style={{backgroundColor: '#FAFAFA', minHeight: '100vh'}}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-10 text-center" 
               style={{backgroundColor: '#FEF2F2', 
                       border: '1px solid #FECACA', 
                       boxShadow: '0 10px 25px rgba(239, 68, 68, 0.1)'}}>
            <h2 className="text-2xl font-light mb-4" 
                style={{fontFamily: 'Cormorant Garamond, serif', color: '#DC2626'}}>
              Error Loading Course
            </h2>
            <p className="mb-6" style={{color: '#DC2626', fontFamily: 'Inter, sans-serif'}}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105" 
              style={{backgroundColor: '#DC2626', color: '#FFFFFF', fontFamily: 'Inter, sans-serif'}}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">
              Course Not Found
            </h2>
            <p className="text-yellow-600">
              The F-Stop to Success course could not be found. Please contact
              support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
  const completedLessons = userProgress?.completedLessons.length || 0;
  const progressPercentage = userProgress?.overallProgress || 0;

  console.log('Dashboard - Course data:', course);
  console.log('Dashboard - Course ID being passed to EnrollmentGuard:', course._id);

  return (
    <EnrollmentGuard user={user} courseId={course._id}>
      <div className="pt-24 pb-16" style={{backgroundColor: '#FAFAFA', minHeight: '100vh'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="rounded-3xl text-white p-12 mb-12" 
             style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)', 
                     boxShadow: '0 20px 40px rgba(26, 26, 26, 0.2)'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Image
                src={user.photoURL || ""}
                alt={user.displayName || "User"}
                width={80}
                height={80}
                className="rounded-full border-4 border-white/20"
              />
              <div>
                <h1 className="text-4xl font-light mb-3" 
                    style={{fontFamily: 'Cormorant Garamond, serif'}}>
                  Welcome back, {user.displayName?.split(" ")[0]}!
                </h1>
                <p className="text-xl" style={{color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Inter, sans-serif'}}>
                  Continue your photography journey with {course.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105" 
                style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                        backdropFilter: 'blur(10px)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        fontFamily: 'Inter, sans-serif'}}
              >
                Home
              </Link>
              <button
                onClick={handleSignOut}
                className="px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2" 
                style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                        backdropFilter: 'blur(10px)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        fontFamily: 'Inter, sans-serif'}}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl p-10" 
                 style={{backgroundColor: '#FFFFFF', 
                         boxShadow: '0 20px 40px rgba(0, 48, 39, 0.1)', 
                         border: '1px solid rgba(0, 48, 39, 0.05)'}}>
              <h2 className="text-3xl font-light mb-8" 
                  style={{fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a'}}>
                Your Progress
              </h2>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-medium" style={{color: '#1a1a1a', fontFamily: 'Inter, sans-serif'}}>
                    Overall Progress
                  </span>
                  <span className="text-lg font-medium" style={{color: '#2D5A4D', fontFamily: 'Inter, sans-serif'}}>
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full rounded-full h-4" style={{backgroundColor: '#F7F5F3'}}>
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%`, 
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)' }}
                  ></div>
                </div>
              </div>
              <p className="text-lg" style={{color: '#666666', fontFamily: 'Inter, sans-serif'}}>
                {completedLessons === 0
                  ? "Welcome to your photography journey! Complete your first lesson to get started."
                  : `Great progress! You've completed ${completedLessons} of ${totalLessons} lessons.`}
              </p>
            </div>

            {/* Course Modules */}
            <div className="rounded-3xl p-10" 
                 style={{backgroundColor: '#FFFFFF', 
                         boxShadow: '0 20px 40px rgba(0, 48, 39, 0.1)', 
                         border: '1px solid rgba(0, 48, 39, 0.05)'}}>
              <h2 className="text-3xl font-light mb-8" 
                  style={{fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a'}}>
                Course Modules
              </h2>
              <div className="space-y-4">
                {course.modules
                  .sort((a, b) => a.moduleNumber - b.moduleNumber)
                  .map((module, index) => {
                    const moduleCompletedLessons = module.lessons.filter(
                      (lesson) =>
                        userProgress?.completedLessons.includes(lesson._id)
                    ).length;
                    const moduleProgress =
                      module.lessons.length > 0
                        ? Math.round(
                            (moduleCompletedLessons / module.lessons.length) *
                              100
                          )
                        : 0;
                    const isCompleted = moduleProgress === 100;
                    const isCurrentModule =
                      userProgress?.currentModule === module._id;
                    const canAccess =
                      index === 0 ||
                      course.modules.slice(0, index).every((prevModule) => {
                        const prevCompleted = prevModule.lessons.filter(
                          (lesson) =>
                            userProgress?.completedLessons.includes(lesson._id)
                        ).length;
                        return prevCompleted === prevModule.lessons.length;
                      });

                    return (
                      <div
                        key={module._id}
                        className={`p-6 rounded-2xl transition-all duration-300 ${
                          canAccess
                            ? "cursor-pointer hover:scale-[1.01]"
                            : "cursor-not-allowed opacity-50"
                        }`}
                        style={{
                          backgroundColor: isCompleted 
                            ? '#F7F5F3' 
                            : moduleProgress > 0 
                              ? '#FAFAFA' 
                              : '#FFFFFF',
                          border: isCompleted 
                            ? '1px solid rgba(0, 48, 39, 0.2)' 
                            : '1px solid rgba(0, 48, 39, 0.1)',
                          boxShadow: canAccess 
                            ? '0 10px 25px rgba(0, 48, 39, 0.08)' 
                            : '0 5px 15px rgba(0, 48, 39, 0.05)'
                        }}
                        onClick={() => {
                          if (canAccess) {
                            setSelectedModule(
                              selectedModule === module._id ? null : module._id
                            );
                            updateCurrentModule(module._id);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-light" 
                              style={{fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a'}}>
                            Module {module.moduleNumber}: {module.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <CheckCircle className="h-5 w-5 text-gray-500" />
                            )}
                            {!canAccess && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                Locked
                              </span>
                            )}
                            {canAccess &&
                              !isCompleted &&
                              index === 0 &&
                              completedLessons === 0 && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Start Here
                                </span>
                              )}
                            {isCurrentModule && !isCompleted && (
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-base mb-4" style={{color: '#666666', fontFamily: 'Inter, sans-serif'}}>
                          {module.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm" style={{color: '#666666', fontFamily: 'Inter, sans-serif'}}>
                            {moduleCompletedLessons}/{module.lessons.length}{" "}
                            lessons completed
                          </span>
                          <span className="text-sm" style={{color: '#666666', fontFamily: 'Inter, sans-serif'}}>
                            ~{module.estimatedDuration}h • {moduleProgress}%
                          </span>
                        </div>
                        <div className="w-full rounded-full h-2" style={{backgroundColor: '#F7F5F3'}}>
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ width: `${moduleProgress}%`, 
                                    background: isCompleted 
                                      ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' 
                                      : 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)' }}
                          ></div>
                        </div>

                        {/* Expanded Module Content */}
                        {selectedModule === module._id && canAccess && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="space-y-3">
                              {module.lessons
                                .sort((a, b) => a.lessonNumber - b.lessonNumber)
                                .map((lesson) => {
                                  const isLessonCompleted =
                                    userProgress?.completedLessons.includes(
                                      lesson._id
                                    ) || false;

                                  return (
                                    <div
                                      key={lesson._id}
                                      className={`p-3 rounded-lg border transition-colors ${
                                        isLessonCompleted
                                          ? "border-gray-300 bg-gray-100 hover:bg-gray-200"
                                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                      }`}
                                    >
                                      <Link
                                        href={`/courses/${course.slug.current}/lessons/${lesson.slug.current}`}
                                        className="block"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm hover:text-blue-600 transition-colors">
                                              Lesson {lesson.lessonNumber}:{" "}
                                              {lesson.title}
                                            </h4>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                              <span>
                                                ~{lesson.estimatedDuration} min
                                              </span>
                                              <span className="capitalize">
                                                {lesson.difficulty}
                                              </span>
                                              {lesson.videoUrl && (
                                                <span className="flex items-center gap-1">
                                                  <Play className="h-3 w-3" />
                                                  Video
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {isLessonCompleted ? (
                                              <CheckCircle className="h-4 w-4 text-gray-500" />
                                            ) : (
                                              <button
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  console.log(
                                                    "Mark complete clicked:",
                                                    lesson._id,
                                                    lesson.title
                                                  );
                                                  console.log(
                                                    "User progress state:",
                                                    userProgress
                                                  );
                                                  markLessonComplete(
                                                    lesson._id
                                                  );
                                                }}
                                                className="w-4 h-4 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors"
                                                title="Mark as complete"
                                              ></button>
                                            )}
                                          </div>
                                        </div>
                                      </Link>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Course Info */}
            <div className="rounded-3xl p-8" 
                 style={{backgroundColor: '#FFFFFF', 
                         boxShadow: '0 15px 30px rgba(0, 48, 39, 0.1)', 
                         border: '1px solid rgba(0, 48, 39, 0.05)'}}>
              <h3 className="text-xl font-light mb-6" 
                  style={{fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a'}}>
                Course Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span style={{color: '#666666', fontFamily: 'Inter, sans-serif'}}>Instructor</span>
                  <span className="font-medium" style={{color: '#1a1a1a', fontFamily: 'Inter, sans-serif'}}>
                    {course.instructor.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {course.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {course.category.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Modules</span>
                  <span className="font-semibold text-gray-900">
                    {course.modules.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-3xl p-8" 
                 style={{backgroundColor: '#FFFFFF', 
                         boxShadow: '0 15px 30px rgba(0, 48, 39, 0.1)', 
                         border: '1px solid rgba(0, 48, 39, 0.05)'}}>
              <h3 className="text-xl font-light mb-6" 
                  style={{fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a'}}>
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lessons Completed</span>
                  <span className="font-semibold text-gray-900">
                    {completedLessons}/{totalLessons}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Course Completion</span>
                  <span className="font-semibold text-blue-600">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Module</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {course.modules.find(
                      (m) => m._id === userProgress?.currentModule
                    )?.title || "Not started"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Finish</span>
                  <span className="font-semibold text-gray-900">
                    {Math.max(
                      1,
                      Math.ceil((totalLessons - completedLessons) / 3)
                    )}{" "}
                    weeks
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-3xl p-8" 
                 style={{backgroundColor: '#FFFFFF', 
                         boxShadow: '0 15px 30px rgba(0, 48, 39, 0.1)', 
                         border: '1px solid rgba(0, 48, 39, 0.05)'}}>
              <h3 className="text-xl font-light mb-6" 
                  style={{fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a'}}>
                {completedLessons === 0
                  ? "Getting Started"
                  : "Continue Learning"}
              </h3>
              <div className="rounded-2xl p-6" style={{backgroundColor: '#F7F5F3', border: '1px solid rgba(0, 48, 39, 0.1)'}}>
                <h4 className="font-medium mb-3" style={{color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif'}}>
                  {completedLessons === 0
                    ? "Welcome to F-Stop to Success!"
                    : "Keep up the great work!"}
                </h4>
                <p className="text-sm mb-4" style={{color: '#666666', fontFamily: 'Inter, sans-serif'}}>
                  {completedLessons === 0
                    ? "Start with Module 1 to begin your photography journey."
                    : `You've completed ${completedLessons} lessons. Continue with your current module.`}
                </p>
                <button
                  className="w-full text-white py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105"
                  style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)', fontFamily: 'Inter, sans-serif'}}
                  onClick={() => {
                    const currentModule = course.modules.find(
                      (m) => m._id === userProgress?.currentModule
                    );
                    if (currentModule) {
                      setSelectedModule(currentModule._id);
                    } else if (course.modules.length > 0) {
                      const firstModule = course.modules.sort(
                        (a, b) => a.moduleNumber - b.moduleNumber
                      )[0];
                      setSelectedModule(firstModule._id);
                      updateCurrentModule(firstModule._id);
                    }
                  }}
                >
                  {completedLessons === 0
                    ? "Start First Module"
                    : "Continue Learning"}
                </button>
              </div>
            </div>

            {/* Community */}
            <div className="rounded-3xl p-8" 
                 style={{backgroundColor: '#FFFFFF', 
                         boxShadow: '0 15px 30px rgba(0, 48, 39, 0.1)', 
                         border: '1px solid rgba(0, 48, 39, 0.05)'}}>
              <h3 className="text-xl font-light mb-6" 
                  style={{fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a'}}>
                Community
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2K+
                  </div>
                  <span className="text-gray-600">Active Students</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    500+
                  </div>
                  <span className="text-gray-600">Success Stories</span>
                </div>
                <button className="w-full text-white py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 mt-4" 
                        style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)', fontFamily: 'Inter, sans-serif'}}>
                  Join Community Forum
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </EnrollmentGuard>
  );
}