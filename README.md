# Veridian IQ | Futuristic AI Smart Agriculture

Welcome to the Veridian IQ ecosystem. To get the application fully functional, follow these setup steps.

## 1. Genkit AI Setup (Gemini)
To enable crop diagnosis and the AI assistant:
1. Go to [Google AI Studio](https://a studio.google.com/app/apikey).
2. Create a free API key.
3. Open the `.env` file in this project.
4. Set `GEMINI_API_KEY=your_key_here`.

## 2. Firebase Setup (Authentication & Reports)
To enable user login and saving reports:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **studio-4318523135-2e5de**.
3. **CRITICAL STEP**: Enable the Identity Toolkit API. Click this link: [Enable Identity Toolkit API](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=studio-4318523135-2e5de).
4. Navigate to **Authentication** > **Sign-in method**.
5. Click **Add new provider** and select **Google**. Enable it and save.
6. Navigate to **Project Settings** (gear icon) > **General**.
7. Copy the configuration object and update these values in your `.env` file:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
8. Enable **Firestore**:
   - Go to **Firestore Database** > **Create database**.
   - Start in **test mode** (for development) and select a location.

## 3. Development
Run the app locally:
```bash
npm run dev
```

Your app is now ready to transform the future of farming!
