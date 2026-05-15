
# AgriZen AI | Zen Smart Agriculture

Welcome to the AgriZen AI ecosystem. To resolve any setup errors and get full functionality, follow these three simple steps.

## 1. Authentication Quick-Fix (Critical)
If you see an "Identity Toolkit Blocked" or "Sign-in Error":

### A. Enable Identity Toolkit API
1. Click this link: [Enable Identity Toolkit API](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com).
2. Ensure project `studio-4318523135-2e5de` is selected in the top bar.
3. Click the **ENABLE** button.

### B. Enable Google Sign-In
1. Go to the [Firebase Authentication Console](https://console.firebase.google.com/project/studio-4318523135-2e5de/authentication/providers).
2. Click **Add new provider**.
3. Select **Google**, enable it, set your support email, and click **Save**.

### C. Check API Key Restrictions
1. Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials).
2. Click on your API Key (usually "Browser key").
3. Under **API Restrictions**, ensure "Don't restrict key" is selected (or at least that "Identity Toolkit API" is allowed).

## 2. Genkit AI Setup (Gemini)
To enable crop diagnosis and the AI assistant:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a free API key.
3. Set `GEMINI_API_KEY=your_key_here` in your `.env` file.

Your app is now ready to transform the future of farming with Zen precision!
