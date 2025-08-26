import { client, writeClient } from "./sanity";

export interface UserEnrollment {
  _id?: string;
  userId: string;
  email: string;
  displayName: string | null;
  roles: string[];
  enrolledCourses: string[];
  enrollmentDate: string;
  lastActivity: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface EnrollmentStatus {
  isEnrolled: boolean;
  hasAccess: boolean;
  enrollmentDate?: string;
  roles: string[];
  source: 'sanity' | 'localStorage' | 'fallback';
}

// Local storage keys
const ENROLLMENT_STORAGE_KEY = 'user-enrollment-data';
const ENROLLED_USERS_KEY = 'enrolled-users';

// Fallback localStorage functions for development/testing
const localStorageService = {
  getUserEnrollment: (userId: string): UserEnrollment | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(`${ENROLLMENT_STORAGE_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setUserEnrollment: (userId: string, enrollment: UserEnrollment): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(`${ENROLLMENT_STORAGE_KEY}-${userId}`, JSON.stringify(enrollment));
      
      // Also track in global enrolled users list
      const enrolledUsers = JSON.parse(localStorage.getItem(ENROLLED_USERS_KEY) || '[]');
      if (enrollment.roles.includes('enrolled') && !enrolledUsers.includes(userId)) {
        enrolledUsers.push(userId);
        localStorage.setItem(ENROLLED_USERS_KEY, JSON.stringify(enrolledUsers));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  removeUserEnrollment: (userId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(`${ENROLLMENT_STORAGE_KEY}-${userId}`);
      
      // Remove from enrolled users list
      const enrolledUsers = JSON.parse(localStorage.getItem(ENROLLED_USERS_KEY) || '[]');
      const updatedUsers = enrolledUsers.filter((id: string) => id !== userId);
      localStorage.setItem(ENROLLED_USERS_KEY, JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  isUserEnrolled: (userId: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const enrolledUsers = JSON.parse(localStorage.getItem(ENROLLED_USERS_KEY) || '[]');
      return enrolledUsers.includes(userId);
    } catch {
      return false;
    }
  }
};

export const improvedUserEnrollmentService = {
  // Get user enrollment record (tries Sanity first, falls back to localStorage)
  getUserEnrollment: async (userId: string): Promise<UserEnrollment | null> => {
    // Try Sanity first
    try {
      const query = `
        *[_type == "userEnrollment" && userId == "${userId}"][0]{
          _id,
          userId,
          email,
          displayName,
          roles,
          enrolledCourses,
          enrollmentDate,
          lastActivity,
          status
        }
      `;
      const result = await client.fetch(query);
      if (result) return result;
    } catch (error) {
      console.warn('Sanity fetch failed, using localStorage fallback:', error);
    }

    // Fallback to localStorage
    return localStorageService.getUserEnrollment(userId);
  },

  // Create user enrollment record
  createUserEnrollment: async (
    userId: string,
    email: string,
    displayName: string | null,
    initialRoles: string[] = []
  ): Promise<UserEnrollment> => {
    const enrollment: UserEnrollment = {
      userId,
      email,
      displayName,
      roles: initialRoles,
      enrolledCourses: [],
      enrollmentDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: 'pending'
    };

    // Try Sanity first
    try {
      const result = await writeClient.create({
        _type: "userEnrollment",
        ...enrollment
      });
      return { ...enrollment, _id: result._id };
    } catch (error) {
      console.warn('Sanity create failed, using localStorage fallback:', error);
      
      // Fallback to localStorage
      localStorageService.setUserEnrollment(userId, enrollment);
      return enrollment;
    }
  },

  // Update user enrollment
  updateUserEnrollment: async (
    enrollmentId: string,
    userId: string,
    updates: Partial<UserEnrollment>
  ): Promise<UserEnrollment> => {
    const updatedData = {
      ...updates,
      lastActivity: new Date().toISOString(),
    };

    // Try Sanity first (only if we have an _id)
    if (enrollmentId && enrollmentId !== 'localStorage') {
      try {
        const result = await writeClient
          .patch(enrollmentId)
          .set(updatedData)
          .commit();
        return result;
      } catch (error) {
        console.warn('Sanity update failed, using localStorage fallback:', error);
      }
    }

    // Fallback to localStorage
    const currentEnrollment = localStorageService.getUserEnrollment(userId);
    if (currentEnrollment) {
      const updated = { ...currentEnrollment, ...updatedData };
      localStorageService.setUserEnrollment(userId, updated);
      return updated;
    }

    throw new Error('User enrollment not found');
  },

  // Add role to user
  addUserRole: async (userId: string, role: string): Promise<UserEnrollment | null> => {
    const enrollment = await improvedUserEnrollmentService.getUserEnrollment(userId);
    if (!enrollment) return null;

    const updatedRoles = [...new Set([...enrollment.roles, role])];
    const enrollmentId = enrollment._id || 'localStorage';
    
    return await improvedUserEnrollmentService.updateUserEnrollment(
      enrollmentId, 
      userId, 
      { roles: updatedRoles }
    );
  },

  // Remove role from user
  removeUserRole: async (userId: string, role: string): Promise<UserEnrollment | null> => {
    const enrollment = await improvedUserEnrollmentService.getUserEnrollment(userId);
    if (!enrollment) return null;

    const updatedRoles = enrollment.roles.filter(r => r !== role);
    const enrollmentId = enrollment._id || 'localStorage';
    
    return await improvedUserEnrollmentService.updateUserEnrollment(
      enrollmentId, 
      userId, 
      { roles: updatedRoles }
    );
  },

  // Enroll user in course
  enrollUserInCourse: async (userId: string, courseId: string): Promise<UserEnrollment | null> => {
    const enrollment = await improvedUserEnrollmentService.getUserEnrollment(userId);
    if (!enrollment) return null;

    const updatedCourses = [...new Set([...enrollment.enrolledCourses, courseId])];
    const updatedRoles = [...new Set([...enrollment.roles, 'enrolled'])];
    const enrollmentId = enrollment._id || 'localStorage';
    
    return await improvedUserEnrollmentService.updateUserEnrollment(
      enrollmentId, 
      userId, 
      {
        enrolledCourses: updatedCourses,
        roles: updatedRoles,
        status: 'active'
      }
    );
  },

  // Check if user is enrolled in a specific course
  isUserEnrolledInCourse: async (userId: string, courseId: string): Promise<boolean> => {
    const enrollment = await improvedUserEnrollmentService.getUserEnrollment(userId);
    return enrollment?.enrolledCourses.includes(courseId) || false;
  },

  // Check user enrollment status
  checkEnrollmentStatus: async (userId: string, courseId?: string): Promise<EnrollmentStatus> => {
    let source: 'sanity' | 'localStorage' | 'fallback' = 'fallback';
    
    // Try getting enrollment data
    const enrollment = await improvedUserEnrollmentService.getUserEnrollment(userId);
    
    if (!enrollment) {
      return {
        isEnrolled: false,
        hasAccess: false,
        roles: [],
        source: 'fallback'
      };
    }

    // Determine source
    if (enrollment._id) {
      source = 'sanity';
    } else {
      source = 'localStorage';
    }

    const hasEnrolledRole = enrollment.roles.includes('enrolled');
    const isEnrolledInCourse = courseId ? enrollment.enrolledCourses.includes(courseId) : true;
    
    return {
      isEnrolled: hasEnrolledRole && isEnrolledInCourse,
      hasAccess: hasEnrolledRole && isEnrolledInCourse && enrollment.status === 'active',
      enrollmentDate: enrollment.enrollmentDate,
      roles: enrollment.roles,
      source
    };
  },

  // Initialize user enrollment on first login
  initializeUser: async (
    userId: string,
    email: string,
    displayName: string | null
  ): Promise<UserEnrollment> => {
    const existing = await improvedUserEnrollmentService.getUserEnrollment(userId);
    if (existing) {
      // Update last activity
      const enrollmentId = existing._id || 'localStorage';
      return await improvedUserEnrollmentService.updateUserEnrollment(
        enrollmentId,
        userId,
        { lastActivity: new Date().toISOString() }
      );
    }

    // Create new enrollment record
    return await improvedUserEnrollmentService.createUserEnrollment(
      userId,
      email,
      displayName
    );
  },

  // Quick enroll function for testing/admin use
  quickEnroll: async (userId: string, email: string, name: string | null): Promise<UserEnrollment> => {
    try {
      // Initialize user if needed
      await improvedUserEnrollmentService.initializeUser(userId, email, name);
      
      // Add enrolled role and activate
      let enrollment = await improvedUserEnrollmentService.addUserRole(userId, 'enrolled');
      if (enrollment) {
        const enrollmentId = enrollment._id || 'localStorage';
        enrollment = await improvedUserEnrollmentService.updateUserEnrollment(
          enrollmentId,
          userId,
          { status: 'active' }
        );
      }
      
      return enrollment || await improvedUserEnrollmentService.getUserEnrollment(userId) as UserEnrollment;
    } catch (error) {
      console.error('Error in quickEnroll:', error);
      throw error;
    }
  },

  // Clear localStorage data (for testing)
  clearLocalStorage: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(ENROLLMENT_STORAGE_KEY) || key === ENROLLED_USERS_KEY) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};