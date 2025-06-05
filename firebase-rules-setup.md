# Firebase Security Rules Setup

## Problem
The new collections `Questions` and `Answers` need proper security rules in Firebase.

## Solution
Go to Firebase Console → Firestore Database → Rules and add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read their own user document
    match /Users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow all authenticated users to read Questions (questionnaire structure)
    match /Questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // For creating default questionnaire
    }
    
    // Allow users to read/write their own answer sessions
    match /Answers/{sessionId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
    }
  }
}
```

## Steps:
1. Open Firebase Console
2. Go to your project
3. Click "Firestore Database" in the left menu
4. Click "Rules" tab
5. Replace the existing rules with the rules above
6. Click "Publish"

## What these rules do:
- **Questions**: Any authenticated user can read/write (needed for questionnaire structure)
- **Answers**: Users can only access their own answer sessions
- **Users**: Users can only access their own user document

After updating the rules, the questionnaire should load properly! 