# Resume AI Setup Guide

This guide will help you set up the AI Resume Assistant feature with OpenAI integration.

## Prerequisites

You can use either:
1. **OpenAI API Key** (paid): Sign up at https://platform.openai.com/
2. **OpenRouter API Key** (FREE): Sign up at https://openrouter.ai/ (recommended for free tier)

### Option 1: OpenRouter (FREE - Recommended)
- Sign up at: https://openrouter.ai/
- Get your API key from: https://openrouter.ai/keys
- API keys start with `sk-or-v1-`
- **Completely FREE** with free models available
- No credit card required

### Option 2: OpenAI (Paid)
- Sign up at: https://platform.openai.com/
- Get your API key from: https://platform.openai.com/api-keys
- **Note**: Requires payment method, free tier includes $5 credit

## Setup Steps

### 1. Get API Key (OpenRouter - FREE Recommended)

**For OpenRouter (FREE):**
1. Go to https://openrouter.ai/signup
2. Create an account or sign in
3. Navigate to API Keys: https://openrouter.ai/keys
4. Click "Create API Key"
5. Copy the key (it starts with `sk-or-v1-`)

**For OpenAI (Paid):**
1. Go to https://platform.openai.com/signup
2. Create an account or sign in
3. Navigate to API Keys: https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (it starts with `sk-`)

### 2. Configure Environment Variables

1. In the `backend` folder, copy `.env.example` to `.env` (if not already done):
   ```bash
   cp env.example .env
   ```

2. Open `.env` and add your API key:
   
   **For OpenRouter (FREE):**
   ```env
   OPENAI_API_KEY=sk-or-v1-your-actual-openrouter-api-key-here
   USE_OPENROUTER=true
   OPENROUTER_MODEL=openai/gpt-3.5-turbo
   ```
   
   **For OpenAI:**
   ```env
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   USE_OPENROUTER=false
   ```
   
   **Note**: The code auto-detects OpenRouter if your key starts with `sk-or-v1-`, so `USE_OPENROUTER=true` is optional.

### 3. Install Dependencies (if not already installed)

The OpenAI package should already be in `package.json`, but if needed:
```bash
cd backend
npm install openai
```

### 4. Start the Backend Server

```bash
cd backend
npm start
# or for development
npm run dev
```

The server should start on `http://localhost:5000`

### 5. Start the Frontend

```bash
cd ..
npm run dev
```

The frontend should start on `http://localhost:3000`

## API Endpoints

The Resume AI endpoints are available at:
- `POST /api/resume-ai/generate-summary` - Generate professional summary
- `POST /api/resume-ai/improve-text` - Improve bullet points/text
- `POST /api/resume-ai/generate-achievements` - Generate achievement statements
- `POST /api/resume-ai/ats-suggestions` - Get ATS optimization suggestions
- `POST /api/resume-ai/extract-keywords` - Extract keywords from job description
- `POST /api/resume-ai/analyze-resume` - Analyze resume and provide feedback

## Model Used

- **OpenRouter**: Uses `openai/gpt-3.5-turbo` by default (or any model you specify)
- **OpenAI**: Uses `gpt-3.5-turbo` (cost-effective, fast, suitable for resume writing)
- **Free Models Available on OpenRouter**:
  - `openai/gpt-oss-120b:free` - Free, high-quality model
  - `openai/gpt-3.5-turbo` - Fast and reliable
  - See all free models at: https://openrouter.ai/models?order=newest&supported_parameters=stream&supported_modalities=text&tier=free

## Cost Considerations

### OpenRouter (FREE)
- **Completely FREE** with free models
- No credit card required
- Free models available: `openai/gpt-oss-120b:free`, `openai/gpt-3.5-turbo`, etc.
- See all free models: https://openrouter.ai/models?tier=free

### OpenAI (Paid)
- GPT-3.5-turbo pricing:
  - Input: $0.50 per 1M tokens
  - Output: $1.50 per 1M tokens
- Typical resume AI requests use:
  - ~200-500 input tokens
  - ~100-300 output tokens
- Estimated cost: ~$0.001-0.002 per request

## Testing

1. Navigate to `http://localhost:3000/resume-builder`
2. Try the AI features:
   - Click "Generate Summary" in the Summary tab
   - Paste text and click "Improve Text" in the Improve tab
   - Click "Check ATS Compatibility" in the ATS tab
   - Paste a job description and click "Extract Keywords"
   - Click "Analyze Resume" for comprehensive feedback

## Troubleshooting

### Error: "Failed to generate summary"
- Check that `OPENAI_API_KEY` is set in `.env`
- Verify the API key is valid
- Check backend logs for detailed error messages
- Ensure backend server is running on port 5000

### Error: "API key not found"
- Make sure `.env` file exists in the `backend` folder
- Restart the backend server after adding the API key
- Check that the key starts with `sk-`

### Rate Limiting
- OpenAI has rate limits based on your tier
- Free tier: 3 requests per minute
- Paid tier: Higher limits
- If you hit limits, wait a minute and try again

### Fallback Behavior
- If OpenAI API fails, the system will use fallback responses
- Check backend logs to see if API calls are failing
- Fallback ensures the feature still works even if API is down

## Security Notes

- **Never commit** `.env` file to git
- Keep your API key secret
- Use environment variables in production
- Consider using a secrets manager for production deployments

## Production Deployment

For production:
1. Set `OPENAI_API_KEY` as an environment variable in your hosting platform
2. Consider adding rate limiting per user
3. Monitor API usage and costs
4. Set up error logging and alerts

## Support

If you encounter issues:
1. Check backend logs: `backend/logs/error.log`
2. Verify API key is correct
3. Test API key directly with OpenAI's API
4. Check network connectivity

