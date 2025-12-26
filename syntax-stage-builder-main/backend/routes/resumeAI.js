const express = require('express');
const { openai, createChatCompletionWithRetry } = require('../utils/ai');

const router = express.Router();

// Default model - use free model if OpenRouter, otherwise gpt-3.5-turbo
// We detect this from the client configuration now
const DEFAULT_MODEL = openai.baseURL.includes('openrouter')
    ? (process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free')
    : 'gpt-3.5-turbo';

// Generate professional summary
router.post('/generate-summary', async (req, res) => {
    try {
        winston.info('📄 Resume AI: Generating professional summary...');
        const { fullName, title, experiences, skills, education } = req.body;

        if (!fullName && !title && (!experiences || experiences.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient data to generate summary'
            });
        }

        const prompt = `Generate a professional resume summary (2-3 sentences) for a ${title || 'professional'} named ${fullName || 'the candidate'}.

Key Information:
- Job Title: ${title || 'Not specified'}
- Years of Experience: ${experiences?.length || 0} position(s)
- Key Skills: ${skills?.slice(0, 10).join(', ') || 'Not specified'}
- Education: ${education?.length > 0 ? education[0].degree + ' in ' + education[0].field : 'Not specified'}

Requirements:
- Professional and concise (2-3 sentences, max 150 words)
- Highlight key achievements and expertise
- Use industry-standard language
- ATS-friendly format
- Focus on value and impact

Generate only the summary text, no additional commentary.`;

        const { completion } = await createChatCompletionWithRetry([{
            role: "system",
            content: "You are an expert resume writer specializing in creating professional, ATS-friendly resume summaries for tech professionals."
        }, {
            role: "user",
            content: prompt
        }], {
            model: DEFAULT_MODEL,
            max_tokens: 200,
            temperature: 0.7,
            stream: false
        });

        const summary = completion.choices[0].message.content.trim();

        winston.info('✅ Resume AI: Summary generated successfully');
        winston.info(`📊 Tokens used: ${completion.usage?.total_tokens || 'N/A'}`);

        res.json({
            success: true,
            summary: summary,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('❌ Generate summary error:', error);
        winston.error('Error details:', error.message);

        // Fallback response if OpenAI fails
        const fallbackSummary = `Experienced ${req.body.title || 'professional'} with expertise in ${req.body.skills?.slice(0, 5).join(', ') || 'software development'}. Proven track record of delivering high-quality solutions and driving results.`;

        res.json({
            success: true,
            summary: fallbackSummary,
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            note: 'Using fallback response'
        });
    }
});

// Improve text/bullet point
router.post('/improve-text', async (req, res) => {
    try {
        const { text, context } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Text is required'
            });
        }

        const prompt = `Improve the following resume bullet point to be more impactful and ATS-friendly. Make it concise, use strong action verbs, and add quantifiable metrics if appropriate.

Original text: "${text}"
${context ? `Context: ${context}` : ''}

Requirements:
- Start with a strong action verb (Developed, Led, Created, Built, Implemented, Optimized, etc.)
- Add quantifiable metrics if possible (percentages, numbers, scale)
- Keep it concise (one sentence)
- Make it achievement-focused, not task-focused
- Use industry-standard terminology

Return only the improved bullet point, starting with "• "`;

        const { completion } = await createChatCompletionWithRetry([{
            role: "system",
            content: "You are an expert resume writer specializing in creating impactful, ATS-optimized bullet points for tech professionals."
        }, {
            role: "user",
            content: prompt
        }], {
            model: DEFAULT_MODEL,
            max_tokens: 150,
            temperature: 0.7,
            stream: false
        });

        let improvedText = completion.choices[0].message.content.trim();
        // Ensure it starts with bullet point
        if (!improvedText.startsWith('•')) {
            improvedText = '• ' + improvedText;
        }

        res.json({
            success: true,
            improvedText: improvedText,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Improve text error:', error);

        // Fallback: simple improvement
        const fallback = `• ${req.body.text.replace(/^[•-]\s*/, '').trim()}`;

        res.json({
            success: true,
            improvedText: fallback,
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            note: 'Using fallback response'
        });
    }
});

// Generate achievement suggestions
router.post('/generate-achievements', async (req, res) => {
    try {
        const { role, company, industry } = req.body;

        const prompt = `Generate 3-5 professional achievement statements for a ${role || 'software developer'} role${company ? ` at ${company}` : ''}${industry ? ` in the ${industry} industry` : ''}.

Requirements:
- Each achievement should be a single bullet point
- Start with strong action verbs
- Include quantifiable metrics (percentages, numbers, scale)
- Focus on impact and results
- Tech industry relevant
- ATS-friendly format

Format as a JSON array of strings. Example format: ["• Developed...", "• Led...", "• Optimized..."]`;

        const { completion } = await createChatCompletionWithRetry([{
            role: "system",
            content: "You are an expert resume writer specializing in creating impactful achievement statements for tech professionals."
        }, {
            role: "user",
            content: prompt
        }], {
            model: DEFAULT_MODEL,
            max_tokens: 300,
            temperature: 0.8,
            stream: false
        });

        let achievements = completion.choices[0].message.content.trim();

        // Try to parse as JSON, fallback to text parsing
        try {
            achievements = JSON.parse(achievements);
        } catch {
            // Parse from text format
            achievements = achievements.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim())
                .filter(line => line.length > 0)
                .slice(0, 5)
                .map(line => line.startsWith('•') ? line : '• ' + line);
        }

        res.json({
            success: true,
            achievements: achievements,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Generate achievements error:', error);

        // Fallback achievements
        const fallback = [
            `• Developed and deployed scalable solutions improving system performance by 40%`,
            `• Led cross-functional team of 5 developers to deliver project ahead of schedule`,
            `• Optimized database queries reducing response time by 60%`
        ];

        res.json({
            success: true,
            achievements: fallback,
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            note: 'Using fallback response'
        });
    }
});

// ATS optimization suggestions
router.post('/ats-suggestions', async (req, res) => {
    try {
        const resumeData = req.body;

        const prompt = `Analyze this resume data and provide ATS (Applicant Tracking System) optimization suggestions.

Resume Data:
- Has Summary: ${resumeData.personalInfo?.summary ? 'Yes' : 'No'}
- Number of Experiences: ${resumeData.experiences?.length || 0}
- Number of Skills: ${resumeData.skills?.length || 0}
- Has Education: ${resumeData.education?.length > 0 ? 'Yes' : 'No'}
- Has Projects: ${resumeData.projects?.length > 0 ? 'Yes' : 'No'}

Provide 5-8 specific, actionable suggestions to improve ATS compatibility. Focus on:
- Missing sections or information
- Keyword optimization
- Formatting improvements
- Content structure
- Industry best practices

Format as a JSON array of suggestion strings.`;

        const { completion } = await createChatCompletionWithRetry([{
            role: "system",
            content: "You are an expert in ATS (Applicant Tracking System) optimization for tech resumes."
        }, {
            role: "user",
            content: prompt
        }], {
            model: DEFAULT_MODEL,
            max_tokens: 400,
            temperature: 0.5,
            stream: false
        });

        let suggestions = completion.choices[0].message.content.trim();

        try {
            suggestions = JSON.parse(suggestions);
        } catch {
            // Parse from text
            suggestions = suggestions.split('\n')
                .filter(line => line.trim() && (line.includes('-') || line.includes('•') || /^\d+\./.test(line)))
                .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim())
                .filter(line => line.length > 0)
                .slice(0, 8);
        }

        res.json({
            success: true,
            suggestions: suggestions,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('ATS suggestions error:', error);

        // Fallback suggestions
        const fallback = [
            "Add a professional summary section",
            "Include more technical skills (aim for 10-15)",
            "Add quantifiable achievements to experiences",
            "Use strong action verbs in descriptions",
            "Ensure contact information is complete"
        ];

        res.json({
            success: true,
            suggestions: fallback,
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            note: 'Using fallback response'
        });
    }
});

// Extract keywords from job description
router.post('/extract-keywords', async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Job description is required'
            });
        }

        const prompt = `Extract the most important technical keywords, skills, and technologies from this job description. Focus on:
- Programming languages
- Frameworks and libraries
- Tools and technologies
- Certifications mentioned
- Soft skills if relevant

Job Description:
${jobDescription.substring(0, 2000)}

Return a JSON array of unique keywords (strings only, no duplicates). Prioritize technical skills over soft skills.`;

        const { completion } = await createChatCompletionWithRetry([{
            role: "system",
            content: "You are an expert at analyzing job descriptions and extracting relevant technical keywords for resume optimization."
        }, {
            role: "user",
            content: prompt
        }], {
            model: DEFAULT_MODEL,
            max_tokens: 300,
            temperature: 0.3,
            stream: false
        });

        let keywords = completion.choices[0].message.content.trim();

        try {
            keywords = JSON.parse(keywords);
        } catch {
            // Parse from text
            keywords = keywords.split('\n')
                .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim())
                .filter(line => line.length > 0 && line.length < 50)
                .slice(0, 20);
        }

        // Remove duplicates and filter
        keywords = [...new Set(keywords)].filter(k => k && k.length > 0);

        res.json({
            success: true,
            keywords: keywords,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Extract keywords error:', error);

        // Fallback: simple keyword extraction
        const techKeywords = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git'];
        const foundKeywords = techKeywords.filter(keyword =>
            req.body.jobDescription?.toLowerCase().includes(keyword.toLowerCase())
        );

        res.json({
            success: true,
            keywords: foundKeywords.length > 0 ? foundKeywords : ['No specific keywords found'],
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            note: 'Using fallback response'
        });
    }
});

// Analyze resume and provide feedback
router.post('/analyze-resume', async (req, res) => {
    try {
        const resumeData = req.body;

        const prompt = `Analyze this resume and provide comprehensive feedback.

Resume Data:
- Name: ${resumeData.personalInfo?.fullName || 'Not provided'}
- Title: ${resumeData.personalInfo?.title || 'Not provided'}
- Summary: ${resumeData.personalInfo?.summary ? 'Present' : 'Missing'}
- Experiences: ${resumeData.experiences?.length || 0}
- Education: ${resumeData.education?.length || 0}
- Skills: ${resumeData.skills?.length || 0}
- Projects: ${resumeData.projects?.length || 0}

Provide analysis in JSON format:
{
  "overallScore": <number 0-100>,
  "strengths": [<array of strings>],
  "weaknesses": [<array of strings>],
  "recommendations": [<array of strings>]
}

Be specific and actionable.`;

        const { completion } = await createChatCompletionWithRetry([{
            role: "system",
            content: "You are an expert resume reviewer specializing in tech industry resumes. Provide constructive, actionable feedback."
        }, {
            role: "user",
            content: prompt
        }], {
            model: DEFAULT_MODEL,
            max_tokens: 500,
            temperature: 0.5,
            stream: false
        });

        let analysis = completion.choices[0].message.content.trim();

        try {
            analysis = JSON.parse(analysis);
        } catch {
            // Fallback analysis
            const score = calculateBasicScore(resumeData);
            analysis = {
                overallScore: score,
                strengths: score >= 70 ? ['Well-structured resume'] : [],
                weaknesses: score < 70 ? ['Needs more content'] : [],
                recommendations: ['Add more details to experiences', 'Include quantifiable achievements']
            };
        }

        res.json({
            success: true,
            analysis: analysis,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Analyze resume error:', error);

        // Fallback analysis
        const score = calculateBasicScore(req.body);
        const fallback = {
            overallScore: score,
            strengths: score >= 70 ? ['Good structure'] : [],
            weaknesses: score < 70 ? ['Needs improvement'] : [],
            recommendations: ['Add more content', 'Include achievements']
        };

        res.json({
            success: true,
            analysis: fallback,
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            note: 'Using fallback response'
        });
    }
});

// Helper function to calculate basic score
function calculateBasicScore(resumeData) {
    let score = 0;
    if (resumeData.personalInfo?.fullName) score += 10;
    if (resumeData.personalInfo?.email) score += 10;
    if (resumeData.personalInfo?.title) score += 10;
    if (resumeData.personalInfo?.summary) score += 15;
    if (resumeData.experiences?.length > 0) score += 20;
    if (resumeData.education?.length > 0) score += 10;
    if (resumeData.skills?.length >= 5) score += 15;
    if (resumeData.projects?.length > 0) score += 10;
    return Math.min(score, 100);
}

module.exports = router;

