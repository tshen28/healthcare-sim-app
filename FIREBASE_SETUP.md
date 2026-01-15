# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your Healthcare Simulation App.

## 📋 Prerequisites

- A Google account
- Node.js and npm/yarn installed
- Expo CLI installed

## 🔥 Firebase Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter a project name (e.g., "Healthcare Sim App")
4. Disable Google Analytics (optional for development)
5. Click "Create Project"

### 2. Register Your App

1. In your Firebase project, click the **Web** icon (`</>`)
2. Register your app with a nickname (e.g., "Healthcare Sim Web")
3. Check "Also set up Firebase Hosting" if needed
4. Click "Register app"
5. Copy the Firebase configuration object

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Firebase configuration values:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-app
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   EXPO_PUBLIC_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCD1234
   ```

### 4. Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Email/Password**
3. Enable the first toggle (Email/Password)
4. Click "Save"

### 5. Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select your preferred location
5. Click "Enable"

### 6. Configure Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add other collection rules as needed
  }
}
```

## 🚀 Running the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Test the authentication:
   - Create a new account using the signup screen
   - Login with your credentials
   - Check Firebase Console → Authentication to see registered users

## 📱 Authentication Features

### Available Functions

All authentication functions are in `src/services/auth.service.ts`:

- **`signup(role, email, password, displayName?)`** - Register a new user
- **`login(email, password)`** - Login existing user
- **`logout()`** - Sign out current user
- **`resetPassword(email)`** - Send password reset email
- **`getCurrentUser()`** - Get current authenticated user

### Usage Example

```typescript
import { signup, login, logout, resetPassword } from '@/src/services/auth.service';

// Sign up a new student
await signup('student', 'student@example.com', 'password123', 'John Doe');

// Login
await login('student@example.com', 'password123');

// Logout
await logout();

// Reset password
await resetPassword('student@example.com');
```

## 🔐 Authentication Context

The app uses `AuthContext` to manage authentication state globally:

```typescript
import { useAuth } from '@/src/context/AuthContext';

function MyComponent() {
  const { user, role, loading } = useAuth();
  
  if (loading) return <Text>Loading...</Text>;
  if (!user) return <Text>Not logged in</Text>;
  
  return <Text>Welcome, {user.email}! Role: {role}</Text>;
}
```

## 🛡️ Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - All config uses `EXPO_PUBLIC_` prefix
3. **Update Firestore rules** - Move to production rules before deploying
4. **Enable App Check** - Add extra security layer (recommended for production)
5. **Monitor Authentication** - Check Firebase Console regularly

## 📝 User Data Structure

When a user signs up, the following document is created in Firestore:

```javascript
{
  email: "user@example.com",
  role: "student", // or "admin"
  displayName: "John Doe",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## ❗ Troubleshooting

### "Firebase: Error (auth/invalid-credential)"
- Check if email/password authentication is enabled in Firebase Console
- Verify your credentials are correct

### "Firebase: Error (auth/email-already-in-use)"
- The email is already registered
- Use the login screen instead

### Environment variables not loading
- Make sure `.env` file is in the root directory
- Restart the Expo development server
- Use `EXPO_PUBLIC_` prefix for all variables

### "Quota exceeded" error
- You've hit Firebase free tier limits
- Check Firebase Console → Usage
- Upgrade to Blaze plan if needed

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Expo with Firebase](https://docs.expo.dev/guides/using-firebase/)

## 🎯 Next Steps

1. Set up password reset functionality in the UI
2. Add email verification
3. Implement social authentication (Google, Apple, etc.)
4. Add user profile editing
5. Set up proper Firestore security rules for production
