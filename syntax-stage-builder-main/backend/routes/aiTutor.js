const express = require('express');
const { authenticateToken, requireSubscription } = require('../middleware/auth');
const winston = require('winston');
const { createChatCompletionWithRetry } = require('../utils/ai');

const router = express.Router();

// AI Tutor conversation
router.post('/chat', authenticateToken, requireSubscription('free'), async (req, res) => {
    try {
        const { message, context, language, code } = req.body;
        const user = req.user;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Build conversation messages
        const messages = [];
        const systemPrompt = createSystemPrompt(user, language || 'general');
        messages.push({ role: "system", content: systemPrompt });

        // Add context and code if provided
        if (context) messages.push({ role: "system", content: `Previous context: ${context}` });
        if (code) messages.push({ role: "system", content: `User's code:\n\`\`\`${language || ''}\n${code}\n\`\`\`` });

        messages.push({ role: "user", content: message });

        const completionData = await createChatCompletionWithRetry(messages, {
            max_tokens: 1000,
            temperature: 0.7
        });

        const completion = completionData.completion || completionData;
        const modelUsed = completionData.modelUsed || completion.model;

        const aiResponse = completion.choices?.[0]?.message?.content || "I couldn't generate a response.";

        // Parse response for code blocks and suggestions
        const parsedResponse = parseAIResponse(aiResponse);

        // Update user's learning analytics (non-blocking)
        updateLearningAnalytics(user, language, message, parsedResponse).catch(err => winston.warn('Analytics update failed', err));

        res.json({
            success: true,
            response: parsedResponse,
            model: modelUsed,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('AI Tutor chat error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to get AI response'
        });
    }
});

// Code analysis and feedback
router.post('/analyze-code', authenticateToken, requireSubscription('free'), async (req, res) => {
    try {
        const { code, language, task } = req.body;
        const user = req.user;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: 'Code and language are required'
            });
        }

        const analysisPrompt = `
You are an expert programming tutor. Analyze the following ${language} code and provide detailed feedback.

Code:
\`\`\`${language}
${code}
\`\`\`

Task: ${task || 'General code review'}

Please provide your analysis in a clean, line-by-line format with bullet points for each section. Use a clear structure.

Format your response exactly with these sections:
# Quality
[Your point-by-point quality assessment here]

# Improvements
[Your point-by-point improvement suggestions here]

# Best Practices
[Your point-by-point best practice suggestions here]

# Security (if applicable)
[Your security notes here]

Ensure each point starts on a new line with a bullet point (• or -).
`;

        const { completion, modelUsed } = await createChatCompletionWithRetry([
            { role: "system", content: "You are an expert programming tutor specializing in code analysis and improvement suggestions." },
            { role: "user", content: analysisPrompt }
        ], {
            max_tokens: 1500,
            temperature: 0.3
        });

        const analysis = completion.choices[0].message.content;
        const structuredAnalysis = parseCodeAnalysis(analysis);

        res.json({
            success: true,
            analysis: structuredAnalysis,
            rawAnalysis: analysis,
            model: modelUsed
        });

    } catch (error) {
        winston.error('Code analysis error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to analyze code'
        });
    }
});

// Generate personalized learning recommendations
router.post('/recommendations', authenticateToken, requireSubscription('free'), async (req, res) => {
    try {
        const { language, topic } = req.body;
        const user = req.user;

        const recommendationPrompt = `
Based on the user's profile, generate personalized learning recommendations.

User Profile:
- Name: ${user.name}
- Difficulty Level: ${user.preferences?.difficulty || 'beginner'}
- Completed Modules: ${user.progress?.completedModules?.length || 0}

Current Request:
- Language: ${language || user.preferences?.preferredLanguage || 'Java'}
- Topic: ${topic || 'general'}

Generate:
1. Next recommended topics to learn
2. Practice exercises based on current level
3. Real-world projects to work on
4. Learning resources (articles, videos, documentation)
5. Estimated time for each recommendation

Format your response as a JSON array of recommendation objects. Each object should have: title, description, difficulty, estimatedTime, category.
Return ONLY the JSON array.
`;

        const { completion, modelUsed } = await createChatCompletionWithRetry([
            { role: "system", content: "You are an expert programming education advisor. Provide structured, personalized learning recommendations." },
            { role: "user", content: recommendationPrompt }
        ], {
            max_tokens: 1000,
            temperature: 0.5
        });

        const recommendationsText = completion.choices[0].message.content;

        // Clean and parse JSON
        let structuredRecommendations;
        try {
            const jsonMatch = recommendationsText.match(/\[[\s\S]*\]/);
            structuredRecommendations = JSON.parse(jsonMatch ? jsonMatch[0] : recommendationsText);
        } catch (error) {
            structuredRecommendations = { text: recommendationsText, raw: true };
        }

        res.json({
            success: true,
            recommendations: structuredRecommendations,
            model: modelUsed
        });

    } catch (error) {
        winston.error('Learning recommendations error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to generate recommendations'
        });
    }
});

// Debug code and explain errors
router.post('/debug-code', authenticateToken, requireSubscription('free'), async (req, res) => {
    try {
        const { code, language, error, expectedOutput } = req.body;
        const user = req.user;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: 'Code and language are required'
            });
        }

        const debugPrompt = `
Debug the following ${language} code and explain the issues.

Code:
\`\`\`${language}
${code}
\`\`\`

Error (if any): ${error || 'No specific error provided'}
Expected Output: ${expectedOutput || 'Not specified'}

Format your response with clear sections for: Error Analysis, Debugging Steps, Corrected Code, and Best Practices.
`;

        const { completion, modelUsed } = await createChatCompletionWithRetry([
            { role: "system", content: "You are an expert programming debugger and tutor. Provide clear, educational debugging guidance." },
            { role: "user", content: debugPrompt }
        ], {
            max_tokens: 1500,
            temperature: 0.3
        });

        const debugResponse = completion.choices[0].message.content;
        const structuredDebug = parseDebugResponse(debugResponse);

        res.json({
            success: true,
            debug: structuredDebug,
            rawResponse: debugResponse,
            model: modelUsed
        });

    } catch (error) {
        winston.error('Code debugging error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to debug code'
        });
    }
});

// Helper functions
function createSystemPrompt(user, language) {
    const difficulty = user.preferences?.difficulty || 'beginner';
    return `You are an expert programming tutor for CodeAcademy Pro. 

Student: ${user.name}
Level: ${difficulty}
Language: ${language}

Guidelines:
1. Explain concepts simply for ${difficulty} level.
2. Provide code examples using markdown blocks.
3. Use bullet points and clear line breaks to make your answers easy to read (like ChatGPT).
4. Be encouraging and provide practical tips.
5. If code is provided, refer to it specifically.`;
}

function parseAIResponse(response) {
    const codeBlocks = response.match(/```[\s\S]*?```/g) || [];
    const suggestions = response.match(/^[-•]\s*(.+)$/gm) || [];
    return {
        text: response,
        code: codeBlocks[0] ? codeBlocks[0].replace(/```\w*\n|```/g, '') : undefined,
        language: codeBlocks[0] ? (codeBlocks[0].match(/```(\w+)/) || [])[1] : undefined,
        suggestions: suggestions.map(s => s.replace(/^[-•]\s*/, ''))
    };
}

function parseCodeAnalysis(analysis) {
    const sections = { quality: '', improvements: '', bestPractices: '' };
    const parts = analysis.split(/^#\s+/m);

    parts.forEach(part => {
        const lines = part.trim().split('\n');
        const header = lines[0].toLowerCase();
        const content = lines.slice(1).join('\n').trim();

        if (header.includes('quality')) sections.quality = content;
        else if (header.includes('improvement')) sections.improvements = content;
        else if (header.includes('best practice')) sections.bestPractices = content;
    });

    return sections;
}

function parseDebugResponse(response) {
    const sections = { analysis: '', steps: '', corrected: '' };
    const parts = response.split(/^#\s+/m);
    parts.forEach(part => {
        if (part.toLowerCase().startsWith('error analysis')) sections.analysis = part;
        else if (part.toLowerCase().startsWith('debugging steps')) sections.steps = part;
        else if (part.toLowerCase().startsWith('corrected code')) sections.corrected = part;
    });
    return sections;
}

async function updateLearningAnalytics(user, language, userMessage, aiResponse) {
    winston.info(`AI Tutor interaction for user ${user.email}: ${language}`);
}

module.exports = router;
