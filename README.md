
# Veridian IQ | Futuristic AI Smart Agriculture

Welcome to the Veridian IQ ecosystem. To resolve the **"Identity Toolkit Blocked"** error and get full functionality, you MUST complete these three steps.

## 1. Authentication Setup (Required to Fix the Error)
If you see the "requests-to-this-api... are-blocked" error, follow these three steps in order:

### A. Enable Google Sign-In Provider (Most Common Fix)
1. Go to the [Firebase Authentication Console](https://console.firebase.google.com/project/studio-4318523135-2e5de/authentication/providers).
2. Click **Get Started** (if it's your first time).
3. Click **Add new provider**.
4. Select **Google**, enable it, set your support email, and click **Save**.

### B. Enable Identity Toolkit API
1. Click this link: [Enable Identity Toolkit API](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=studio-4318523135-2e5de).
2. Ensure you see project `studio-4318523135-2e5de` in the top bar.
3. Click **ENABLE**.

### C. Check API Key Restrictions
1. Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials?project=studio-4318523135-2e5de).
2. Click on your API Key (the one ending in `...jNw`).
3. Under **API Restrictions**, ensure "Don't restrict key" is selected, OR ensure "Identity Toolkit API" is added to the allowed list.

## 2. Genkit AI Setup (Gemini)
To enable crop diagnosis and the AI assistant:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a free API key.
3. Set `GEMINI_API_KEY=your_key_here` in your `.env` file.

## 3. Troubleshooting
- **API Still Blocked?**: Wait 60 seconds after enabling and then **refresh your browser page**.
- **Project Not Visible?**: Ensure you are logged into the **correct Google account** in the top-right profile icon of the Google Cloud console. Check the "All" tab in the project selector.

Your app is now ready to transform the future of farming!
