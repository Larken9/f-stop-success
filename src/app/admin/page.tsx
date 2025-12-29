'use client';

import AdminRouteGuard from '@/app/components/AdminRouteGuard';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { userService, UserStats } from '@/app/lib/user-service';
import { userEnrollmentService } from '@/app/lib/user-enrollment';
import { Shield, UserPlus, UserCheck, UserX, TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';

interface User {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
  enrolled?: boolean;
  enrolledAt?: any;
  createdAt?: any;
  lastLoginAt?: any;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'admin'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersSnapshot, enrollmentsSnapshot, userStats] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'userEnrollments')),
        userService.getUserStats()
      ]);

      // Get users from the 'users' collection
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      // Get all user IDs from userEnrollments collection
      const enrollmentUserIds = new Set(enrollmentsSnapshot.docs.map(doc => doc.id));
      const existingUserIds = new Set(usersData.map(u => u.id));

      // Find users that exist in userEnrollments but not in users collection
      const missingUsers: User[] = [];
      enrollmentsSnapshot.docs.forEach(doc => {
        if (!existingUserIds.has(doc.id)) {
          const enrollmentData = doc.data();
          missingUsers.push({
            id: doc.id,
            email: enrollmentData.email || 'Unknown',
            displayName: enrollmentData.displayName || 'Unknown User',
            role: 'user',
            enrolled: enrollmentData.roles?.includes('enrolled') || false,
          });
        }
      });

      // Merge both lists
      const allUsers = [...usersData, ...missingUsers];

      setUsers(allUsers);
      setStats(userStats);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load admin data. Please check your Firebase connection.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const updateUserEnrollment = async (userId: string, enrolled: boolean) => {
    try {
      // Update the users collection (for admin dashboard display)
      await userService.updateEnrollment(userId, enrolled);

      // Also update the userEnrollments collection (for actual course access)
      if (enrolled) {
        const userData = users.find(u => u.id === userId);
        if (userData) {
          // Initialize user if needed, then enroll them
          await userEnrollmentService.quickEnroll(userId, userData.email, userData.displayName || null);
        }
      } else {
        // Unenroll: remove the 'enrolled' role and set status to 'inactive'
        const enrollment = await userEnrollmentService.getUserEnrollment(userId);
        if (enrollment) {
          await userEnrollmentService.removeUserRole(userId, 'enrolled');
          await userEnrollmentService.updateUserEnrollment(userId, { status: 'inactive' });
        }
      }

      fetchData();
    } catch (error) {
      console.error('Error updating enrollment:', error);
      alert('Failed to update enrollment');
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(userData => {
    if (filter === 'enrolled') return userData.enrolled;
    if (filter === 'admin') return userData.role === 'admin';
    return true;
  });

  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.email}</p>
          </div>

          {/* Analytics Section */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-gray-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Enrolled Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEnrolled}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">New Users This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.newUsersThisMonth}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsersThisMonth}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Stats Row */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Enrollment Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Enrollments This Month:</span>
                    <span className="font-semibold">{stats.newEnrollmentsThisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrollment Rate:</span>
                    <span className="font-semibold">
                      {stats.totalUsers > 0 ? Math.round((stats.totalEnrolled / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin Users:</span>
                    <span className="font-semibold">{stats.adminCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Filter Users:</span>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as 'all' | 'enrolled' | 'admin')}
                      className="border border-gray-300 rounded px-3 py-1"
                    >
                      <option value="all">All Users ({users.length})</option>
                      <option value="enrolled">Enrolled ({users.filter(u => u.enrolled).length})</option>
                      <option value="admin">Admins ({users.filter(u => u.role === 'admin').length})</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                User Management ({filteredUsers.length} users)
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No users found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((userData) => (
                        <tr key={userData.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {userData.displayName || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500">ID: {userData.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {userData.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                userData.role === 'admin' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {userData.role || 'user'}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                userData.enrolled
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {userData.enrolled ? 'Enrolled' : 'Not Enrolled'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-col space-y-2">
                              <div className="flex space-x-2">
                                <select
                                  value={userData.role || 'user'}
                                  onChange={(e) => updateUserRole(userData.id, e.target.value)}
                                  className="text-xs border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <button
                                  onClick={() => updateUserEnrollment(userData.id, !userData.enrolled)}
                                  className={`text-xs px-2 py-1 rounded ${
                                    userData.enrolled
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {userData.enrolled ? 'Unenroll' : 'Enroll'}
                                </button>
                              </div>
                              <button
                                onClick={() => deleteUser(userData.id)}
                                className="text-red-600 hover:text-red-900 text-xs"
                                disabled={userData.id === user?.uid}
                              >
                                Delete User
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Instructions</h2>
              <div className="prose max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">User Roles:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>User:</strong> Basic access, no admin privileges</li>
                      <li>• <strong>Admin:</strong> Full dashboard access & user management</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Enrollment Status:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Enrolled:</strong> User has access to course content</li>
                      <li>• <strong>Not Enrolled:</strong> User cannot access course content</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> Use the filter dropdown to quickly view specific user groups. 
                    Enrollment changes take effect immediately - no need for users to sign out/in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
}