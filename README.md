# veil

A collaborative Messenger Single-Page Application

## Table of Contents
- [Key Features](#key-features)
- [Setup Instructions](#setup-instructions)<br><br>

## Key Features

- **User Authentication**  
  Secure user authentication powered by Firebase, ensuring a seamless sign-in experience.
  
- **Meeting Scheduling & Dyte Integration**  
  Schedule and manage meetings with built-in integration for Dyte video calls.
  ![Meeting Scheduling](https://ventsislavs6.sg-host.com/veil/meetings.png)<br>
  ![Dyte Video Calls](https://ventsislavs6.sg-host.com/veil/dyte.png)<br>

- **Friend Invitations & Channel Communication**  
  Invite users to connect as friends and engage in direct or group chats. Create teams with public and private channels for more focused conversations.  
  
- **Media Sharing**  
  Share media easily, including GIFs with Giphy integration and image file uploads.
  ![Giphy Integration](https://ventsislavs6.sg-host.com/veil/giphy.png)<br>

- **Customizable Themes**  
  Personalize the interface with multiple theme options to suit your style.
  ![Theme Customization](https://ventsislavs6.sg-host.com/veil/edit_profile.png)<br>

- **Movable Dashboard Widgets**  
  Reorganize your dashboard with widgets that can be moved using the Muuri grid library. Widget configuration is saved locally in localStorage for persistence.
  ![Dashboard Widgets](https://ventsislavs6.sg-host.com/veil/dashboard.png)<br>

- **Interactive Notes**  
  Take notes that stay with you across different views, thanks to real-time updates via context management. Notes can be moved freely on the dashboard.
  ![Notes Feature](https://ventsislavs6.sg-host.com/veil/notes.png)<br><br>


## Setup Instructions

### Step 1: Create an account in [Firebase](https://firebase.google.com/), follow the required steps to create a new web project and get the config information.

### Step 2: Create an API key in [Giphy](https://developers.giphy.com/docs/api/).

### Step 3: Update the Real-time Database Rules as follows:

```plaintext

{
  "rules": {
    ".read": "now < 1767139200000",  // 2025-12-31
    ".write": "now < 1767139200000",  // 2025-12-31
    "users": {
      ".indexOn": "id"
    },
    "meetings": {
      ".indexOn": ["id","participants"]
  
    },
    "notes": {
      ".indexOn": ["id", "username"]
    },
  },
}

```

### Step 4: Configure the Environment Variables

1. Navigate to the `/template` folder of the project.
2. Create a `.env.local` file in the `/template` folder if it doesn't already exist.
3. Open the `.env.local` file and add the following environment variables:

   ```plaintext
   VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
   VITE_FIREBASE_DATABASE_URL=YOUR_FIREBASE_DATABASE_URL
   VITE_GIPHY_API_KEY=YOUR_GIPHY_API_KEY
   ```

   **Explanation:**

   - **VITE_FIREBASE_API_KEY**: This is the API key for your Firebase project. Replace `YOUR_FIREBASE_API_KEY` with the actual API key provided by Firebase.
   - **VITE_FIREBASE_AUTH_DOMAIN**: This is the authentication domain for your Firebase project. Replace `YOUR_FIREBASE_AUTH_DOMAIN` with the domain provided by Firebase.
   - **VITE_FIREBASE_PROJECT_ID**: This is the unique identifier for your Firebase project. Replace `YOUR_FIREBASE_PROJECT_ID` with your project's ID.
   - **VITE_FIREBASE_STORAGE_BUCKET**: This is the storage bucket URL for your Firebase project. Replace `YOUR_FIREBASE_STORAGE_BUCKET` with your storage bucket URL.
   - **VITE_FIREBASE_MESSAGING_SENDER_ID**: This is the messaging sender ID for Firebase Cloud Messaging. Replace `YOUR_FIREBASE_MESSAGING_SENDER_ID` with the provided ID.
   - **VITE_FIREBASE_APP_ID**: This is the app ID for your Firebase project. Replace `YOUR_FIREBASE_APP_ID` with your app's ID.
   - **VITE_FIREBASE_DATABASE_URL**: This is the database URL for your Firebase Realtime Database. Replace `YOUR_FIREBASE_DATABASE_URL` with your database's URL.

   **Important:** Keep this file secure and avoid sharing it publicly as it contains sensitive information.

### Step 5: Install Dependencies

1. Open a terminal and navigate to the `/template` folder of the project.
2. Run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```

   This will install all the required packages for the project as specified in the `package.json` file.

### Step 6: Run the Application

1. After installing the dependencies, remain in the `/template` folder.
2. Run the following command to start the development server:

   ```bash
   npm run dev
   ```

   This will start the application in development mode. The server will usually be accessible at `http://localhost:5173` (or the port specified in your configuration).

3. Open your web browser and navigate to the address displayed in your terminal to see the running application.
