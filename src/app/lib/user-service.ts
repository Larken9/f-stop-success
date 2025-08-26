import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role: 'user' | 'admin';
  enrolled: boolean;
  enrolledAt?: any; // Optional field - only exists when user is/was enrolled
  createdAt: any;
  lastLoginAt: any;
}

export interface UserStats {
  totalUsers: number;
  totalEnrolled: number;
  newUsersThisMonth: number;
  newEnrollmentsThisMonth: number;
  activeUsersThisMonth: number;
  adminCount: number;
}

export const userService = {
  // Create or update user document when they sign in
  async createOrUpdateUser(user: User): Promise<UserData> {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const userData: UserData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      role: 'user', // Default role
      enrolled: false, // Default enrollment status
      createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };

    // If user already exists, preserve their settings
    if (userSnap.exists()) {
      const existingData = userSnap.data();
      userData.role = existingData.role || 'user';
      userData.enrolled = existingData.enrolled || false;
      // Only set enrolledAt if it exists and is not undefined
      if (existingData.enrolledAt) {
        userData.enrolledAt = existingData.enrolledAt;
      }
    }

    // Remove undefined fields before saving to Firebase
    const cleanUserData = Object.fromEntries(
      Object.entries(userData).filter(([_, value]) => value !== undefined)
    );

    await setDoc(userRef, cleanUserData, { merge: true });
    return userData;
  },

  // Get user data
  async getUserData(uid: string): Promise<UserData | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    return null;
  },

  // Check if user is admin
  async isAdmin(uid: string): Promise<boolean> {
    const userData = await this.getUserData(uid);
    return userData?.role === 'admin' || false;
  },

  // Update user enrollment status
  async updateEnrollment(uid: string, enrolled: boolean): Promise<void> {
    const userRef = doc(db, 'users', uid);
    const updateData: any = { enrolled };
    
    if (enrolled) {
      updateData.enrolledAt = serverTimestamp();
    }
    // Note: We don't remove enrolledAt when unenrolling to preserve history
    
    await setDoc(userRef, updateData, { merge: true });
  },

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthTimestamp = Timestamp.fromDate(startOfMonth);
    
    let totalUsers = 0;
    let totalEnrolled = 0;
    let newUsersThisMonth = 0;
    let newEnrollmentsThisMonth = 0;
    let activeUsersThisMonth = 0;
    let adminCount = 0;
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data() as UserData;
      totalUsers++;
      
      if (userData.enrolled) {
        totalEnrolled++;
        
        // Check if enrolled this month
        if (userData.enrolledAt && userData.enrolledAt.seconds) {
          const enrolledTimestamp = new Timestamp(userData.enrolledAt.seconds, userData.enrolledAt.nanoseconds);
          if (enrolledTimestamp.toDate() >= startOfMonth) {
            newEnrollmentsThisMonth++;
          }
        }
      }
      
      if (userData.role === 'admin') {
        adminCount++;
      }
      
      // Check if user was created this month
      if (userData.createdAt && userData.createdAt.seconds) {
        const createdTimestamp = new Timestamp(userData.createdAt.seconds, userData.createdAt.nanoseconds);
        if (createdTimestamp.toDate() >= startOfMonth) {
          newUsersThisMonth++;
        }
      }
      
      // Check if user was active this month (last login)
      if (userData.lastLoginAt && userData.lastLoginAt.seconds) {
        const lastLoginTimestamp = new Timestamp(userData.lastLoginAt.seconds, userData.lastLoginAt.nanoseconds);
        if (lastLoginTimestamp.toDate() >= startOfMonth) {
          activeUsersThisMonth++;
        }
      }
    });
    
    return {
      totalUsers,
      totalEnrolled,
      newUsersThisMonth,
      newEnrollmentsThisMonth,
      activeUsersThisMonth,
      adminCount
    };
  }
};