
## TaskMaster - Intelligent To-Do App
A robust, feature-rich mobile To-Do application built with React Native CLI and TypeScript. This app features secure User Authentication, real-time cloud syncing via Firebase, and a custom "Smart Sort" algorithm that prioritizes tasks based on urgency and importance.

## Features

1.User Authentication: Secure Sign Up & Login using Firebase Auth (Email/Password).
2.Real-time Database: Instant data syncing across devices using Firestore.
3.Task Management: Create, Read, Update, and Delete (CRUD) tasks.
4.Task Details: Add titles, descriptions, categories, priorities, and deadlines.
5.Status Tracking: Mark tasks as Active or Completed.
6.Smart Sorting Algorithm: A custom logic that calculates an "Urgency Score" combining Priority (High/Medium/Low) and Time-to-Deadline to auto-sort the most critical tasks to the top.
7.Advanced UI: Clean, modern interface using react-native-vector-icons and distinct color coding for priorities.
8.Filtering: Filter tasks by Status (All/Active/Completed) or Priority.
9.Date Picker: Native Android/iOS date and time selection.
10.Project Architecture: Scalable folder structure using the Feature-First pattern and Redux Toolkit.

## Tech Stack
Framework: React Native CLI (v0.73+)
Language: TypeScript
State Management: Redux Toolkit (@reduxjs/toolkit, react-redux)
Backend: Firebase Authentication & Cloud Firestore
Navigation: React Navigation (Native Stack)
UI Components: react-native-vector-icons, @react-native-community/datetimepicker

## The "Smart Sort" Algorithm
To satisfy the "Mix Algorithm" requirement, the app uses a weighted scoring system:
Score = (PriorityWeight * Multiplier) - (TimeUntilDeadline)

1.Priority Weights: High (3), Medium (2), Low (1).
2.Logic:
High priority tasks get a massive score boost.
Tasks closer to the deadline reduce the score less than tasks far away.
Result: A "High Priority" task due tomorrow will always appear above a "Low Priority" task due today.


## Installation & Setup
Follow these steps to run the project locally.

### Prerequisites
Node.js (>= 18)
Java Development Kit (JDK 17)
Android Studio (for Android Emulator)
Xcode (for iOS Simulator - Mac only)

### Steps
1. Clone the repository

git clone https://github.com/your-username/TodoMasterNew.git
cd TodoMasterNew

2. Install Dependencies

npm install

3. Firebase Setup 
Create a project in the Firebase Console.
Enable Authentication (Email/Password provider).
Enable Cloud Firestore (Create database in Test Mode).
Add an Android App with package name: com.todomasternew.
Download google-services.json and place it in android/app/

4. Run on Android

npx react-native run-android

5. Run on iOS (Mac only)

cd ios && pod install && cd ..
npx react-native run-ios

### Screenshots

1. Login Screen

<img width="412" height="727" alt="Image" src="https://github.com/user-attachments/assets/21c77baa-3e85-475b-854b-221fc91a7f23" />

2.  Home Screen

<img width="439" height="769" alt="Image" src="https://github.com/user-attachments/assets/24fc6d74-3c0d-4641-975b-1e64ff7f0569" />

3 . Add Task Screen

<img width="432" height="771" alt="Image" src="https://github.com/user-attachments/assets/47d451c0-b7d0-4d24-ae2b-f9895b833338" />
