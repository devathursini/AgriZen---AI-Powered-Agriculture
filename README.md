
# AgriZen AI | Zen Smart Agriculture

Welcome to the AgriZen AI ecosystem. If you are seeing a "Requests are blocked" error during sign-in, follow these exact steps to fix the configuration in your Google Cloud account.

## 1. Authentication Quick-Fix (API Key Restriction)
If you see a "requests-to-this-api-identitytoolkit...are-blocked" error, your API Key is restricted.

### The Solution:
1.  Go to the [Google Cloud Credentials Console](https://console.cloud.google.com/apis/credentials).
2.  Look for the API Key you are using (likely named **"Browser key"** or similar).
3.  Click the key name to edit its settings.
4.  Scroll down to **"API restrictions"**.
5.  **Option A (Easiest):** Change it to **"Don't restrict key"** for testing.
6.  **Option B (Secure):** Click the dropdown and ensure that **"Identity Toolkit API"** is checked in the list of allowed APIs.
7.  Click **Save**. It may take 1-2 minutes for the change to propagate.

## 2. Enable Identity Toolkit API
Ensure the service itself is enabled for your project:
1.  Go to the [Identity Toolkit API Page](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com).
2.  Click **Enable**.

## 3. Enable Google Sign-In in Firebase
1.  Go to the [Firebase Authentication Console](https://console.firebase.google.com/project/_/authentication/providers).
2.  Click **Add new provider**.
3.  Select **Google**, enable it, and save.

## 4. Genkit AI Setup (Gemini)
To enable crop diagnosis and the AI assistant:
1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create a free API key.
3.  Set `GEMINI_API_KEY=your_key_here` in your `.env` file.

Your app is now ready to transform the future of farming with Zen precision!
