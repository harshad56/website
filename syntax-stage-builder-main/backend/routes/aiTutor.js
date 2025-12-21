const express = require('express');
const OpenAI = require('openai');
const { authenticateToken, requireSubscription } = require('../middleware/auth');
const { db } = require('../config/supabase');
const winston = require('winston');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// AI Tutor conversation
router.post('/chat', authenticateToken, requireSubscription('free'), async(req, res) => {
    try {
        const { message, context, language, code } = req.body;
        const user = req.user;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Build conversation context
        const conversationContext = buildConversationContext(user, context, language, code);

        // Create system prompt based on user's learning level
        const systemPrompt = createSystemPrompt(user, language);

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                    role: "system",
                    content: systemPrompt
                },
                ...conversationContext,
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
            stream: false
        });

        const aiResponse = completion.choices[0].message.content;

        // Parse response for code blocks and suggestions
        const parsedResponse = parseAIResponse(aiResponse);

        // Update user's learning analytics
        await updateLearningAnalytics(user, language, message, parsedResponse);

        res.json({
            success: true,
            response: parsedResponse,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('AI Tutor chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get AI response'
        });
    }
});

// Code analysis and feedback
router.post('/analyze-code', authenticateToken, requireSubscription('free'), async(req, res) => {
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

Please provide:
1. Code quality assessment
2. Potential improvements
3. Best practices suggestions
4. Security considerations (if applicable)
5. Performance optimizations (if applicable)
6. Specific examples of improvements

Format your response with clear sections and code examples.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                    role: "system",
                    content: "You are an expert programming tutor specializing in code analysis and improvement suggestions."
                },
                {
                    role: "user",
                    content: analysisPrompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.3,
            stream: false
        });

        const analysis = completion.choices[0].message.content;

        // Parse analysis for structured feedback
        const structuredAnalysis = parseCodeAnalysis(analysis);

        res.json({
            success: true,
            analysis: structuredAnalysis,
            rawAnalysis: analysis,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Code analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze code'
        });
    }
});

// Generate personalized learning recommendations
router.post('/recommendations', authenticateToken, requireSubscription('free'), async(req, res) => {
    try {
        const { language, topic } = req.body;
        const user = req.user;

        const recommendationPrompt = `
Based on the user's profile, generate personalized learning recommendations.

User Profile:
- Name: ${user.name}
- Preferred Language: ${user.preferences.preferredLanguage}
- Difficulty Level: ${user.preferences.difficulty}
- Completed Modules: ${user.progress.completedModules.length}
- Total Points: ${user.progress.totalPoints}
- Current Streak: ${user.progress.currentStreak} days

Current Request:
- Language: ${language || user.preferences.preferredLanguage}
- Topic: ${topic || 'general'}

Generate:
1. Next recommended topics to learn
2. Practice exercises based on current level
3. Real-world projects to work on
4. Learning resources (articles, videos, documentation)
5. Estimated time for each recommendation
6. Difficulty progression path

Format as JSON with clear structure.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                    role: "system",
                    content: "You are an expert programming education advisor. Provide structured, personalized learning recommendations."
                },
                {
                    role: "user",
                    content: recommendationPrompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.5,
            stream: false
        });

        const recommendations = completion.choices[0].message.content;

        // Try to parse as JSON, fallback to text
        let structuredRecommendations;
        try {
            structuredRecommendations = JSON.parse(recommendations);
        } catch (error) {
            structuredRecommendations = {
                text: recommendations,
                topics: [],
                exercises: [],
                projects: [],
                resources: []
            };
        }

        res.json({
            success: true,
            recommendations: structuredRecommendations,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Learning recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate recommendations'
        });
    }
});

// Debug code and explain errors
router.post('/debug-code', authenticateToken, requireSubscription('free'), async(req, res) => {
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

Please provide:
1. Error analysis and explanation
2. Step-by-step debugging process
3. Corrected code with comments
4. Common mistakes to avoid
5. Best practices for this type of code
6. Testing suggestions

Make your explanation suitable for a ${user.preferences.difficulty} level programmer.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                    role: "system",
                    content: "You are an expert programming debugger and tutor. Provide clear, educational debugging guidance."
                },
                {
                    role: "user",
                    content: debugPrompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.3,
            stream: false
        });

        const debugResponse = completion.choices[0].message.content;

        // Parse debug response for structured feedback
        const structuredDebug = parseDebugResponse(debugResponse);

        res.json({
            success: true,
            debug: structuredDebug,
            rawResponse: debugResponse,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Code debugging error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to debug code'
        });
    }
});

// Generate practice exercises
router.post('/generate-exercises', authenticateToken, requireSubscription('pro'), async(req, res) => {
    try {
        const { language, topic, difficulty, count = 5 } = req.body;
        const user = req.user;

        const exercisePrompt = `
Generate ${count} programming exercises for ${language} focusing on ${topic}.

User Level: ${difficulty || user.preferences.difficulty}
User's Current Progress: ${user.progress.completedModules.length} modules completed

Requirements:
1. Exercises should be appropriate for the user's level
2. Include a mix of theoretical and practical questions
3. Provide clear problem statements
4. Include expected outputs or test cases
5. Vary in complexity within the difficulty level
6. Include hints for challenging problems

Format each exercise with:
- Problem statement
- Expected output
- Difficulty rating (1-5)
- Hints (optional)
- Solution approach
- Related concepts

Format as JSON array.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                    role: "system",
                    content: "You are an expert programming instructor. Generate engaging, educational exercises."
                },
                {
                    role: "user",
                    content: exercisePrompt
                }
            ],
            max_tokens: 2000,
            temperature: 0.4,
            stream: false
        });

        const exercises = completion.choices[0].message.content;

        // Try to parse as JSON, fallback to text
        let structuredExercises;
        try {
            structuredExercises = JSON.parse(exercises);
        } catch (error) {
            structuredExercises = {
                text: exercises,
                exercises: []
            };
        }

        res.json({
            success: true,
            exercises: structuredExercises,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Generate exercises error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate exercises'
        });
    }
});

// Helper functions
function buildConversationContext(user, context, language, code) {
    const messages = [];

    // Add user's learning context
    if (context) {
        messages.push({
            role: "system",
            content: `Previous context: ${context}`
        });
    }

    // Add code context if provided
    if (code) {
        messages.push({
            role: "system",
            content: `User's code:\n\`\`\`${language}\n${code}\n\`\`\``
        });
    }

    return messages;
}

function createSystemPrompt(user, language) {
    const difficulty = user.preferences.difficulty;
    const completedModules = user.progress.completedModules.length;
    const totalPoints = user.progress.totalPoints;

    return `You are an expert programming tutor for CodeAcademy Pro. 

Student Profile:
- Name: ${user.name}
- Learning Level: ${difficulty}
- Completed Modules: ${completedModules}
- Total Points: ${totalPoints}
- Preferred Language: ${user.preferences.preferredLanguage}

Current Language: ${language}

Guidelines:
1. Adapt your explanations to the student's level (${difficulty})
2. Provide clear, step-by-step explanations
3. Include code examples when relevant
4. Encourage best practices and good coding habits
5. Be encouraging and supportive
6. Ask follow-up questions to ensure understanding
7. Provide practical examples and real-world applications
8. Include learning tips and memory aids

Format your responses with:
- Clear explanations
- Code examples (when relevant)
- Learning tips
- Next steps or practice suggestions
- Related concepts to explore

Be conversational but educational.`;
}

function parseAIResponse(response) {
    // Extract code blocks
    const codeBlocks = response.match(/```[\s\S]*?```/g) || [];

    // Extract suggestions (lines starting with - or •)
    const suggestions = response.match(/^[-•]\s*(.+)$/gm) || [];

    // Extract learning tips
    const learningTips = response.match(/💡\s*(.+)$/gm) || [];

    return {
        text: response,
        codeBlocks: codeBlocks.map(block => block.replace(/```/g, '')),
        suggestions: suggestions.map(s => s.replace(/^[-•]\s*/, '')),
        learningTips: learningTips.map(tip => tip.replace(/^💡\s*/, '')),
        hasCode: codeBlocks.length > 0,
        hasSuggestions: suggestions.length > 0
    };
}

function parseCodeAnalysis(analysis) {
    const sections = {
        quality: '',
        improvements: '',
        bestPractices: '',
        security: '',
        performance: '',
        examples: ''
    };

    // Simple parsing - in production, use more sophisticated NLP
    const lines = analysis.split('\n');
    let currentSection = '';

    for (const line of lines) {
        if (line.toLowerCase().includes('quality')) currentSection = 'quality';
        else if (line.toLowerCase().includes('improvement')) currentSection = 'improvements';
        else if (line.toLowerCase().includes('best practice')) currentSection = 'bestPractices';
        else if (line.toLowerCase().includes('security')) currentSection = 'security';
        else if (line.toLowerCase().includes('performance')) currentSection = 'performance';
        else if (line.toLowerCase().includes('example')) currentSection = 'examples';

        if (currentSection && line.trim()) {
            sections[currentSection] += line + '\n';
        }
    }

    return sections;
}

function parseDebugResponse(response) {
    const sections = {
        errorAnalysis: '',
        debuggingSteps: '',
        correctedCode: '',
        commonMistakes: '',
        bestPractices: '',
        testingSuggestions: ''
    };

    const lines = response.split('\n');
    let currentSection = '';

    for (const line of lines) {
        if (line.toLowerCase().includes('error')) currentSection = 'errorAnalysis';
        else if (line.toLowerCase().includes('debug')) currentSection = 'debuggingSteps';
        else if (line.toLowerCase().includes('correct')) currentSection = 'correctedCode';
        else if (line.toLowerCase().includes('mistake')) currentSection = 'commonMistakes';
        else if (line.toLowerCase().includes('best practice')) currentSection = 'bestPractices';
        else if (line.toLowerCase().includes('test')) currentSection = 'testingSuggestions';

        if (currentSection && line.trim()) {
            sections[currentSection] += line + '\n';
        }
    }

    return sections;
}

async function updateLearningAnalytics(user, language, userMessage, aiResponse) {
    try {
        // Update user's learning analytics
        // This would typically involve storing conversation history
        // and analyzing learning patterns

        // For now, just log the interaction
        winston.info(`AI Tutor interaction for user ${user.email}: ${language} - ${userMessage.substring(0, 100)}...`);

    } catch (error) {
        winston.error('Update learning analytics error:', error);
    }
}

module.exports = router;