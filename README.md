# Veridian IQ | Futuristic AI Smart Agriculture

Welcome to the Veridian IQ ecosystem. To get the application fully functional, follow these setup steps.

## 1. Genkit AI Setup (Gemini)
To enable crop diagnosis and the AI assistant:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a free API key.
3. Open the `.env` file in this project.
4. Set `GEMINI_API_KEY=your_key_here`.

## 2. Firebase Setup (Authentication & Reports)
To enable user login and saving reports:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **Project Settings** (gear icon) > **General**.
4. Scroll down to **Your apps** and add a **Web App** (</> icon).
5. Copy the configuration object and update these values in your `.env` file:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - (The `authDomain` is automatically derived, but you can set `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` if preferred).
6. Enable **Google Auth**:
   - Go to **Authentication** > **Sign-in method**.
   - Click **Add new provider** and select **Google**.
   - Enable it and save.
7. Enable **Firestore**:
   - Go to **Firestore Database** > **Create database**.
   - Start in **test mode** (for development) and select a location.

## 3. Development
Run the app locally:
```bash
npm run dev
```

Your app is now ready to transform the future of farming!