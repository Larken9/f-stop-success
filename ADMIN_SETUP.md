# Admin Dashboard Setup Guide

## Overview
This application has a secure admin dashboard that only users with the admin role can access. Admin roles can only be granted manually through the Firebase Console or through the admin dashboard itself.

## How It Works
1. **User Registration**: When users sign in with Google, a document is automatically created in the `users` collection in Firestore
2. **Default Role**: All new users get the role `user` by default
3. **Admin Role**: Only users with role `admin` can access `/admin`
4. **Route Protection**: The `AdminRouteGuard` component protects admin routes

## Granting Admin Access

### Method 1: Firebase Console (Recommended for first admin)
1. Go to your Firebase Console
2. Navigate to Firestore Database
3. Find the `users` collection
4. Locate the user document by their UID
5. Edit the document and change `role` from `user` to `admin`
6. The user needs to sign out and sign back in for changes to take effect

### Method 2: Through Admin Dashboard (For existing admins)
1. Sign in as an admin user
2. Go to `/admin`
3. Find the user in the user management table
4. Use the dropdown to change their role to "Admin"
5. The user needs to refresh or sign back in for changes to take effect

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx                 # Admin dashboard
│   ├── components/
│   │   └── AdminRouteGuard.tsx      # Route protection component
│   ├── lib/
│   │   ├── firebase.ts              # Firebase configuration
│   │   └── user-service.ts          # User management utilities
│   └── login/
│       └── page.tsx                 # Login page for testing
└── hooks/
    └── useAuth.ts                   # Authentication hook with admin checking
```

## Features

### Admin Dashboard (`/admin`)
- **User Management**: View all registered users with filtering options
- **Role Assignment**: Change user roles between 'user' and 'admin'  
- **Enrollment Management**: Grant/revoke course access with one click
- **User Analytics**: Real-time statistics and growth metrics
- **User Deletion**: Remove users from the system
- **Access Control**: Automatically redirects non-admin users

### Analytics & Insights
- **Total Users**: See your complete user base
- **Enrolled Users**: Track course enrollment numbers
- **Monthly Growth**: New users and enrollments this month
- **Active Users**: Users who have logged in this month
- **Enrollment Rate**: Percentage of users who are enrolled
- **Admin Count**: Number of admin users in the system

### Security Features
- **Route Protection**: `AdminRouteGuard` blocks unauthorized access
- **Authentication Required**: Must be signed in to access admin routes
- **Role-based Access**: Only users with `role: 'admin'` can access
- **Auto-redirect**: Non-admin users are redirected to home page

## Testing the System

1. **Set up the first admin**:
   ```bash
   # Start the development server
   npm run dev
   
   # Go to /login and sign in with Google
   # Then manually set role to 'admin' in Firebase Console
   ```

2. **Test admin access**:
   - Visit `/admin` - should show the dashboard
   - Try accessing `/admin` with a non-admin account - should redirect

3. **Test user management**:
   - Create a test user account
   - Use admin dashboard to promote them to admin
   - Test their access to admin features

## Database Structure

### Users Collection (`users`)
```javascript
{
  uid: "firebase-user-id",
  email: "user@example.com", 
  displayName: "User Name",
  role: "user" | "admin",           // Default: "user"
  enrolled: boolean,                // Default: false
  enrolledAt: timestamp,            // When user was enrolled (if applicable)
  createdAt: timestamp,
  lastLoginAt: timestamp
}
```

## Environment Variables Required
Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firestore Security Rules
Make sure your Firestore rules allow admin users to read/write user documents:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin users can read/write all user documents
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Support
If you need help setting up admin access, check:
1. Firebase Console for user documents
2. Browser console for any authentication errors
3. Firestore security rules for permission issues