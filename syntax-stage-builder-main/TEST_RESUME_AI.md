# How to Test Resume AI Features

## Quick Test Steps

### 1. Start the Backend Server
```bash
cd backend
npm start
```

You should see:
```
🚀 CodeAcademy Pro Backend running on port 5000
Server running on port 5000
```

### 2. Start the Frontend
```bash
# In a new terminal
npm run dev
```

Frontend should start on `http://localhost:3000`

### 3. Open Resume Builder Page
Navigate to: **http://localhost:3000/resume-builder**

### 4. Test Each AI Feature

#### Test 1: Generate Professional Summary
1. Click on the **"Summary"** tab in the AI Assistant sidebar
2. Click **"Generate Summary"** button
3. **Expected**: You should see a professional summary appear in the text box
4. **Check**: Look at browser console (F12) for any errors
5. **Check**: Look at backend terminal for API call logs

#### Test 2: Generate Achievement Ideas
1. Click on the **"Ideas"** tab in the AI Assistant sidebar
2. Click **"New Idea"** button
3. **Expected**: A new achievement statement should appear
4. **Check**: Should be different each time you click

#### Test 3: Improve Text
1. Click on the **"Improve"** tab
2. Type or paste a bullet point like: "Worked on a project"
3. Click **"Improve Text"** button
4. **Expected**: An improved version with action verbs and metrics should appear
5. **Example**: "Worked on a project" → "• Developed and delivered a project resulting in 40% improvement"

#### Test 4: ATS Suggestions
1. Click on the **"ATS"** tab
2. Click **"Check ATS Compatibility"** button
3. **Expected**: A list of suggestions should appear
4. **Check**: Should show specific recommendations for your resume

#### Test 5: Extract Keywords
1. Click on the **"Keywords"** tab
2. Paste a job description (example below)
3. Click **"Extract Keywords"** button
4. **Expected**: Relevant keywords should appear as badges
5. **Test Job Description**:
   ```
   We are looking for a Senior Full-Stack Developer with experience in React, Node.js, TypeScript, and AWS. 
   Must have knowledge of Docker, Kubernetes, and CI/CD pipelines. Experience with PostgreSQL and MongoDB required.
   ```

#### Test 6: Analyze Resume
1. Click on the **"Analyze"** tab
2. Click **"Analyze Resume"** button
3. **Expected**: 
   - Overall score (0-100)
   - Strengths list
   - Weaknesses list
   - Recommendations list

## How to Verify It's Working

### Method 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try an AI feature
4. **Look for**:
   - ✅ No red errors
   - ✅ API call logs (if you added console.log)
   - ✅ Success messages

### Method 2: Check Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try an AI feature (e.g., Generate Summary)
4. **Look for**:
   - Request to: `http://localhost:5000/api/resume-ai/generate-summary`
   - Status: `200 OK` (success) or `500` (error)
   - Response: Should contain `"success": true` and the generated text

### Method 3: Check Backend Terminal
1. Look at your backend terminal
2. **You should see**:
   - API request logs
   - Any error messages
   - OpenAI/OpenRouter API responses

### Method 4: Check Backend Logs
```bash
# View error logs
cat backend/logs/error.log

# View combined logs
cat backend/logs/combined.log
```

## Expected Behavior

### ✅ Working Correctly:
- AI features generate responses within 2-5 seconds
- Generated text appears in the UI
- No error messages in console
- Backend shows successful API calls
- Toast notifications appear (e.g., "Professional summary generated!")

### ❌ Not Working:
- Long loading times (>10 seconds) or timeouts
- Error messages in browser console
- "Failed to generate..." toast messages
- Backend shows error logs
- Network requests return 500 or 400 status

## Troubleshooting

### Issue: "Failed to generate summary"
**Check:**
1. Is backend server running? (http://localhost:5000)
2. Is OPENAI_API_KEY set in `.env`?
3. Is the API key valid? (starts with `sk-or-v1-` for OpenRouter)
4. Check backend logs: `backend/logs/error.log`

### Issue: Long loading times
**Possible causes:**
1. OpenRouter free tier rate limits
2. Network issues
3. API key issues

**Solution:**
- Wait a minute and try again
- Check OpenRouter dashboard for rate limits
- Verify API key is correct

### Issue: No response at all
**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Backend terminal for errors
4. CORS issues (should be configured in server.js)

### Issue: "Network Error" or "Failed to fetch"
**Check:**
1. Backend is running on port 5000
2. Frontend is trying to connect to correct URL
3. No firewall blocking localhost:5000
4. CORS is properly configured

## Quick Test Script

You can also test the API directly using curl:

```bash
# Test Generate Summary
curl -X POST http://localhost:5000/api/resume-ai/generate-summary \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "title": "Software Developer",
    "experiences": [{"company": "Tech Corp", "role": "Developer"}],
    "skills": ["JavaScript", "React", "Node.js"],
    "education": [{"degree": "BS", "field": "Computer Science"}]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "summary": "Experienced Software Developer...",
  "usage": {...}
}
```

## Success Indicators

✅ **Everything is working if:**
- All 6 AI features generate responses
- Responses are relevant and well-formatted
- No errors in console or backend logs
- Toast notifications appear
- Generated content can be copied/used

## Next Steps

Once verified working:
1. Fill in your resume data
2. Use AI to generate summary
3. Use AI to improve your bullet points
4. Get ATS optimization suggestions
5. Extract keywords from job postings
6. Get comprehensive resume analysis

Enjoy your AI-powered resume builder! 🚀




