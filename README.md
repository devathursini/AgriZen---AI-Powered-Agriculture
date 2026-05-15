# Veridian IQ | Futuristic AI Smart Agriculture

Welcome to the Veridian IQ ecosystem. To get the application fully functional, follow these setup steps.

## 1. Genkit AI Setup (Gemini)
To enable crop diagnosis and the AI assistant:
1. Go to [Google AI Studio](https://a studio.google.com/app/apikey).
2. Create a free API key.
3. Open the `.env` file in this project.
4. Set `GEMINI_API_KEY=your_key_here`.

## 2. Firebase Setup (Authentication & Reports)
To enable user login and saving reports, you must complete these **three** steps:

### A. Enable Identity Toolkit API (The "Blocked" Error Fix)
This is the most common cause of the "Requests to this API are blocked" error.
1. Click this link: [Enable Identity Toolkit API](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=studio-4318523135-2e5de).
2. **Crucial:** In the top-right corner of the page, ensure you are logged into the **correct Google account** that owns the Firebase project.
3. Click the **ENABLE** button.

### B. Enable Google Sign-In Provider
1. Go to the [Firebase Console](https://console.firebase.google.com/project/studio-4318523135-2e5de/authentication/providers).
2. Click **Add new provider**.
3. Select **Google**, enable it, and click **Save**.

### C. Update Environment Variables
1. Go to [Project Settings](https://console.firebase.google.com/project/studio-4318523135-2e5de/settings/general).
2. Scroll down to **Your apps** and copy the configuration object.
3. Update your `.env` file with your specific values.

## 3. Troubleshooting: "I cannot see my project"
If you click the link and the project is not found:
- **Account Switcher**: Click your profile picture in the top-right of the Google Cloud Console. Select the account you used to create the Firebase project.
- **Project Selection**: Use the project dropdown next to the "Google Cloud" logo at the top left to manually search for `studio-4318523135-2e5de`.

## 4. Enable Firestore Database
1. Go to [Firestore Database](https://console.firebase.google.com/project/studio-4318523135-2e5de/firestore).
2. Click **Create database**.
3. Start in **test mode** (for development) and select a location.

## 5. Development
Run the app locally:
```bash
npm run dev
```

Your app is now ready to transform the future of farming!