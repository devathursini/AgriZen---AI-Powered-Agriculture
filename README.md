
# AgriZen AI | Zen Smart Agriculture

Welcome to the AgriZen AI ecosystem. To resolve any setup errors and get full functionality, follow these simple steps.

## 1. Authentication Quick-Fix (Critical)
If you see an "Identity Toolkit Blocked" or "Sign-in Error":

### A. Check API Key Restrictions
The most common cause of "blocked" errors when the API is already enabled is a key restriction.
1. Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials).
2. Look for the API Key you are using (it's likely the one named "Browser key" or similar).
3. Click on the key name to edit it.
4. Under **API Restrictions**, ensure that "Identity Toolkit API" is added to the list of allowed APIs.
5. Alternatively, set it to **"Don't restrict key"** for testing purposes.

### B. Enable Google Sign-In
1. Go to the [Firebase Authentication Console](https://console.firebase.google.com/project/studio-4318523135-2e5de/authentication/providers).
2. Click **Add new provider**.
3. Select **Google**, enable it, set your support email, and click **Save**.

## 2. Genkit AI Setup (Gemini)
To enable crop diagnosis and the AI assistant:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a free API key.
3. Set `GEMINI_API_KEY=your_key_here` in your `.env` file.

Your app is now ready to transform the future of farming with Zen precision!
