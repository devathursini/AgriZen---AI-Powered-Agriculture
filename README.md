
# Veridian IQ | Futuristic AI Smart Agriculture

Welcome to the Veridian IQ ecosystem. To resolve the "Identity Toolkit" error and get full functionality, please complete these steps in order.

## 1. Firebase Setup (Crucial for Sign-In)
If you see the "requests-to-this-api... are-blocked" error, follow these three steps:

### A. Enable Identity Toolkit API
1. Click this link: [Enable Identity Toolkit API](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=studio-4318523135-2e5de).
2. Ensure you see project `studio-4318523135-2e5de` in the top bar.
3. Click **ENABLE**. If it's already enabled, click **MANAGE** and ensure no errors are listed.

### B. Enable Google Sign-In Provider
1. Go to the [Firebase Authentication Console](https://console.firebase.google.com/project/studio-4318523135-2e5de/authentication/providers).
2. Click **Add new provider**.
3. Select **Google**, enable it, set your support email, and click **Save**.

### C. Check API Key Restrictions
1. Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials?project=studio-4318523135-2e5de).
2. Click on the API Key you are using (ending in `...jNw`).
3. Under **API Restrictions**, ensure "Don't restrict key" is selected, OR add "Identity Toolkit API" to the allowed list.

## 2. Genkit AI Setup (Gemini)
To enable crop diagnosis and the AI assistant:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a free API key.
3. Set `GEMINI_API_KEY=your_key_here` in your `.env` file.

## 3. Enable Firestore Database
1. Go to [Firestore Database](https://console.firebase.google.com/project/studio-4318523135-2e5de/firestore).
2. Click **Create database**.
3. Start in **test mode** and select a location.

## 4. Troubleshooting
- **API Blocked?**: Ensure you are logged into the **correct Google account** that owns the Firebase project. Check the top-right profile icon in the Google Cloud console.
- **Still seeing error?**: Wait 60 seconds after enabling and then **refresh your browser page**.

Your app is now ready to transform the future of farming!
