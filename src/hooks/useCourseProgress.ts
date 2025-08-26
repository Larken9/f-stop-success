'use client';

import { useState, useEffect } from 'react';
import { client, writeClient } from '@/app/lib/sanity';
import { UserProgress, Course } from '@/types/course';
import { userProgressQuery } from '@/app/lib/sanity-queries';

export function useCourseProgress(userId: string, courseId: string, course?: Course) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !courseId) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        let progressData = await client.fetch(userProgressQuery, {
          userId,
          courseId
        });

        if (!progressData) {
          // Create initial progress record
          const initialProgress = {
            _type: "userProgress",
            userId,
            courseId,
            completedLessons: [],
            currentModule: course?.modules[0]?._id || "",
            overallProgress: 0,
            lastAccessed: new Date().toISOString(),
            enrollmentDate: new Date().toISOString(),
          };

          progressData = await writeClient.create(initialProgress) as unknown as UserProgress;
        }

        setProgress(progressData);
      } catch (err) {
        console.error('Error fetching/creating progress:', err);
        setError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, courseId, course]);

  const markLessonComplete = async (lessonId: string) => {
    if (!progress || !course) return;

    const updatedCompletedLessons = progress.completedLessons.includes(lessonId)
      ? progress.completedLessons
      : [...progress.completedLessons, lessonId];

    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );
    const newProgress = Math.round(
      (updatedCompletedLessons.length / totalLessons) * 100
    );

    try {
      const updatedProgress = await writeClient
        .patch(progress._id!)
        .set({
          completedLessons: updatedCompletedLessons,
          overallProgress: newProgress,
          lastAccessed: new Date().toISOString(),
        })
        .commit();

      setProgress(updatedProgress as unknown as UserProgress);
      return updatedProgress;
    } catch (err) {
      console.error('Error updating progress:', err);
      setError('Failed to update progress');
      throw err;
    }
  };

  const updateCurrentModule = async (moduleId: string) => {
    if (!progress) return;

    try {
      const updatedProgress = await writeClient
        .patch(progress._id!)
        .set({
          currentModule: moduleId,
          lastAccessed: new Date().toISOString(),
        })
        .commit();

      setProgress(updatedProgress as unknown as UserProgress);
      return updatedProgress;
    } catch (err) {
      console.error('Error updating current module:', err);
      setError('Failed to update current module');
      throw err;
    }
  };

  return { 
    progress, 
    loading, 
    error,
    markLessonComplete, 
    updateCurrentModule 
  };
}