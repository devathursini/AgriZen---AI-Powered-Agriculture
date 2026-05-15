
# AgriZen AI | Zen Smart Agriculture

Welcome to the AgriZen AI ecosystem. To resolve any setup errors and get full functionality, follow these steps.

## 1. Authentication Setup
If you see an "Identity Toolkit Blocked" error, follow these three steps:

### A. Enable Google Sign-In Provider
1. Go to the [Firebase Authentication Console](https://console.firebase.google.com/project/studio-4318523135-2e5de/authentication/providers).
2. Click **Add new provider**.
3. Select **Google**, enable it, set your support email, and click **Save**.

### B. Enable Identity Toolkit API
1. Click this link: [Enable Identity Toolkit API](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=studio-4318523135-2e5de).
2. Ensure you see project `studio-4318523135-2e5de` in the top bar.
3. Click **ENABLE**.

### C. Check API Key Restrictions
1. Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials?project=studio-4318523135-2e5de).
2. Click on your API Key.
3. Under **API Restrictions**, ensure "Don't restrict key" is selected.

## 2. Genkit AI Setup (Gemini)
To enable crop diagnosis and the AI assistant:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a free API key.
3. Set `GEMINI_API_KEY=your_key_here` in your `.env` file.

Your app is now ready to transform the future of farming with Zen precision!
