import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface UserEnrollment {
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
}

const COLLECTION_NAME = 'userEnrollments';

export const userEnrollmentService = {
  async getUserEnrollment(userId: string): Promise<UserEnrollment | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserEnrollment;
      }
      return null;
    } catch (error) {
      console.error('Error getting user enrollment:', error);
      throw error;
    }
  },

  async initializeUser(userId: string, email: string, displayName: string | null): Promise<UserEnrollment> {
    try {
      const existing = await this.getUserEnrollment(userId);
      if (existing) {
        await this.updateUserEnrollment(userId, {
          lastActivity: new Date().toISOString()
        });
        return existing;
      }

      const enrollment: UserEnrollment = {
        userId,
        email,
        displayName,
        roles: [],
        enrolledCourses: [],
        enrollmentDate: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        status: 'pending'
      };

      const docRef = doc(db, COLLECTION_NAME, userId);
      await setDoc(docRef, enrollment);
      
      return enrollment;
    } catch (error) {
      console.error('Error initializing user:', error);
      throw error;
    }
  },

  async addUserRole(userId: string, role: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentData = docSnap.data() as UserEnrollment;
        const updatedRoles = [...new Set([...currentData.roles, role])];
        
        await updateDoc(docRef, {
          roles: updatedRoles,
          lastActivity: new Date().toISOString()
        });
      } else {
        throw new Error('User not found. Please initialize user first.');
      }
    } catch (error) {
      console.error('Error adding user role:', error);
      throw error;
    }
  },

  async removeUserRole(userId: string, role: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentData = docSnap.data() as UserEnrollment;
        const updatedRoles = currentData.roles.filter(r => r !== role);
        
        await updateDoc(docRef, {
          roles: updatedRoles,
          lastActivity: new Date().toISOString()
        });
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error removing user role:', error);
      throw error;
    }
  },

  async updateUserEnrollment(userId: string, updates: Partial<UserEnrollment>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      await updateDoc(docRef, {
        ...updates,
        lastActivity: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user enrollment:', error);
      throw error;
    }
  },

  async quickEnroll(userId: string, email: string, displayName: string | null): Promise<UserEnrollment> {
    try {
      let enrollment = await this.getUserEnrollment(userId);
      
      if (!enrollment) {
        enrollment = await this.initializeUser(userId, email, displayName);
      }
      
      await this.addUserRole(userId, 'enrolled');
      await this.updateUserEnrollment(userId, { status: 'active' });
      
      return await this.getUserEnrollment(userId) as UserEnrollment;
    } catch (error) {
      console.error('Error in quick enroll:', error);
      throw error;
    }
  },

  async enrollUserInCourse(userId: string, courseId: string): Promise<UserEnrollment | null> {
    try {
      const enrollment = await this.getUserEnrollment(userId);
      if (!enrollment) return null;

      const updatedCourses = [...new Set([...enrollment.enrolledCourses, courseId])];
      await this.addUserRole(userId, 'enrolled');
      await this.updateUserEnrollment(userId, {
        enrolledCourses: updatedCourses,
        status: 'active'
      });

      return await this.getUserEnrollment(userId);
    } catch (error) {
      console.error('Error enrolling user in course:', error);
      throw error;
    }
  },

  async isUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      const enrollment = await this.getUserEnrollment(userId);
      return enrollment?.enrolledCourses.includes(courseId) || false;
    } catch (error) {
      console.error('Error checking course enrollment:', error);
      return false;
    }
  },

  async checkEnrollmentStatus(userId: string, courseId?: string): Promise<EnrollmentStatus> {
    try {
      const enrollment = await this.getUserEnrollment(userId);
      
      if (!enrollment) {
        return {
          isEnrolled: false,
          hasAccess: false,
          roles: []
        };
      }

      const hasEnrolledRole = enrollment.roles.includes('enrolled');
      // For general access, having 'enrolled' role is sufficient
      // For specific course access, check both role and course enrollment
      const isEnrolledInCourse = courseId ? 
        (enrollment.enrolledCourses.includes(courseId) || hasEnrolledRole) : 
        hasEnrolledRole;
      
      return {
        isEnrolled: hasEnrolledRole,
        hasAccess: hasEnrolledRole && enrollment.status === 'active',
        enrollmentDate: enrollment.enrollmentDate,
        roles: enrollment.roles
      };
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      return {
        isEnrolled: false,
        hasAccess: false,
        roles: []
      };
    }
  }
};