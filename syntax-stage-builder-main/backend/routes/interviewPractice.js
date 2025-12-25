const express = require('express');
const OpenAI = require('openai');
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');

const router = express.Router();

// Initialize OpenAI/OpenRouter
const useOpenRouter = process.env.USE_OPENROUTER === 'true' || process.env.OPENAI_API_KEY?.startsWith('sk-or-v1-');
const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : undefined;

const openaiConfig = {
    apiKey: apiKey
};

if (useOpenRouter) {
    openaiConfig.baseURL = 'https://openrouter.ai/api/v1';
}

const openai = new OpenAI(openaiConfig);

const FALLBACK_MODELS = [
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemini-flash-1.5:free'
];

const DEFAULT_MODEL = FALLBACK_MODELS[0];

/**
 * Helper to call OpenAI/OpenRouter with retries and model fallbacks
 */
async function createChatCompletionWithRetry(params, maxRetries = 2) {
    let lastError;

    // Try each model in the fallback chain
    for (const model of FALLBACK_MODELS) {
        let retries = 0;
        while (retries <= maxRetries) {
            try {
                winston.info(`🤖 Attempting completion with model: ${model} (Attempt ${retries + 1})`);
                const completion = await openai.chat.completions.create({
                    ...params,
                    model: model
                });
                winston.info(`✅ Completion successful with ${model}`);
                return completion;
            } catch (error) {
                lastError = error;
                const isRateLimit = error.status === 429;
                const isNotFound = error.status === 404;
                const isRetryable = isRateLimit || error.status >= 500;

                if (isNotFound) {
                    winston.warn(`❌ Model ${model} is not available (404). Skipping...`);
                    break;
                }

                if (!isRetryable || retries === maxRetries) {
                    winston.warn(`❌ Model ${model} failed permanently: ${error.message}. Moving to next fallback...`);
                    break;
                }

                // Exponential backoff for retries
                const delay = Math.pow(2, retries) * 1000;
                winston.info(`🔄 Model ${model} rate limited or server error. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retries++;
            }
        }
    }

    throw lastError;
}

// Interview question categories
const QUESTION_CATEGORIES = {
    behavioral: [
        'Tell me about yourself',
        'Why do you want to work here?',
        'What are your strengths?',
        'What are your weaknesses?',
        'Describe a challenging situation',
        'How do you handle stress?',
        'Where do you see yourself in 5 years?',
        'Why should we hire you?'
    ],
    technical: [
        'Explain time complexity',
        'Design a system',
        'Reverse a linked list',
        'Two sum problem',
        'Explain REST APIs',
        'Database normalization',
        'System design basics',
        'Algorithm optimization'
    ],
    systemDesign: [
        'Design a URL shortener',
        'Design a chat system',
        'Design a social media feed',
        'Design a search engine',
        'Design a payment system',
        'Design a video streaming service'
    ]
};

// Generate AI interview questions
router.post('/generate-questions', async (req, res) => {
    try {
        const { category, difficulty, count = 5, role, company } = req.body;

        winston.info(`📝 Generating ${count} ${category} interview questions`);

        const prompt = `Generate ${count} professional interview questions for a ${role || 'software engineer'} position${company ? ` at ${company}` : ''}.

Category: ${category}
Difficulty Level: ${difficulty || 'medium'}

Requirements:
- Questions should be realistic and commonly asked in tech interviews
- Vary the difficulty appropriately
- Include both conceptual and practical questions
- Make them relevant to ${role || 'software engineering'}

Format as JSON array of objects with:
{
  "question": "question text",
  "type": "${category}",
  "difficulty": "easy|medium|hard",
  "tips": "brief tip for answering"
}

Return only the JSON array, no additional text.`;

        const completion = await createChatCompletionWithRetry({
            messages: [{
                role: "system",
                content: "You are an expert interview coach specializing in tech industry interviews. Generate realistic, helpful interview questions."
            }, {
                role: "user",
                content: prompt
            }],
            max_tokens: 1000,
            temperature: 0.7,
            stream: false
        });

        let questions = completion.choices[0].message.content.trim();

        try {
            questions = JSON.parse(questions);
        } catch {
            // Fallback to predefined questions
            const categoryQuestions = QUESTION_CATEGORIES[category] || QUESTION_CATEGORIES.behavioral;
            questions = categoryQuestions.slice(0, count).map((q, i) => ({
                question: q,
                type: category,
                difficulty: difficulty || 'medium',
                tips: 'Think about your experience and provide specific examples.'
            }));
        }

        res.json({
            success: true,
            questions: questions,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Generate questions error:', error);

        // Fallback questions
        const category = req.body.category || 'behavioral';
        const categoryQuestions = QUESTION_CATEGORIES[category] || QUESTION_CATEGORIES.behavioral;
        const questions = categoryQuestions.slice(0, req.body.count || 5).map((q) => ({
            question: q,
            type: category,
            difficulty: req.body.difficulty || 'medium',
            tips: 'Think about your experience and provide specific examples.'
        }));

        res.json({
            success: true,
            questions: questions,
            note: 'Using fallback questions'
        });
    }
});

// General AI Chat endpoint
router.post('/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        winston.info('💬 AI Chat request received');

        // Construct messages array with system prompt
        const messages = [
            {
                role: "system",
                content: "You are a helpful and knowledgeable AI assistant for a coding platform. You help users with programming concepts, interview preparation, and general coding questions. Be concise, encouraging, and provide code examples where helpful."
            },
            ...history,
            {
                role: "user",
                content: message
            }
        ];

        const completion = await createChatCompletionWithRetry({
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
            stream: false
        });

        const reply = completion.choices[0].message.content;

        res.json({
            success: true,
            reply: reply,
            model: completion.model,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('AI Chat error:', error);

        const isRateLimit = error.status === 429;
        const errorMessage = isRateLimit
            ? "Multiple AI providers are currently busy. This usually happens when daily free quotas are reached. Please try again in a few minutes or add a small credit to your OpenRouter account for instant access."
            : `AI Assistant is currently unavailable: ${error.message || 'System error'}`;

        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
});

// Get AI feedback on interview answer
router.post('/evaluate-answer', async (req, res) => {
    try {
        const { question, answer, category } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                message: 'Question and answer are required'
            });
        }

        winston.info('📊 Evaluating interview answer...');

        const prompt = `Evaluate this interview answer and provide constructive feedback.

Question: ${question}
Answer: ${answer}
Category: ${category || 'general'}

Provide feedback in JSON format:
{
  "score": <number 0-100>,
  "strengths": [<array of strengths>],
  "weaknesses": [<array of areas to improve>],
  "suggestions": [<array of specific suggestions>],
  "overall": "<brief overall assessment>"
}

Be constructive and specific. Focus on:
- Clarity and structure
- Relevance to the question
- Use of examples
- Technical accuracy (if technical question)
- Communication skills

Return only the JSON object, no additional text.`;

        const completion = await createChatCompletionWithRetry({
            messages: [{
                role: "system",
                content: "You are an expert interview coach providing constructive feedback to help candidates improve."
            }, {
                role: "user",
                content: prompt
            }],
            max_tokens: 500,
            temperature: 0.5,
            stream: false
        });

        let feedback = completion.choices[0].message.content.trim();

        try {
            feedback = JSON.parse(feedback);
        } catch {
            // Fallback feedback
            feedback = {
                score: 70,
                strengths: ['Good attempt', 'Clear communication'],
                weaknesses: ['Could use more specific examples', 'Structure could be improved'],
                suggestions: ['Add concrete examples', 'Use STAR method (Situation, Task, Action, Result)'],
                overall: 'Good answer with room for improvement. Focus on adding specific examples and structuring your response better.'
            };
        }

        res.json({
            success: true,
            feedback: feedback,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Evaluate answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to evaluate answer'
        });
    }
});

// Get interview tips and preparation guide
router.post('/preparation-guide', async (req, res) => {
    try {
        const { role, company, category } = req.body;

        winston.info(`📚 Generating preparation guide for ${role} at ${company || 'tech company'}`);

        const prompt = `Create a comprehensive interview preparation guide for a ${role || 'software engineer'} position${company ? ` at ${company}` : ''}.

Focus on: ${category || 'general interview preparation'}

Include:
1. Key topics to review
2. Common questions and how to answer them
3. Technical concepts to know
4. Best practices and tips
5. What to research about the company

Format as JSON:
{
  "topics": [<array of topics>],
  "commonQuestions": [<array of questions with brief answers>],
  "technicalConcepts": [<array of concepts>],
  "tips": [<array of tips>],
  "companyResearch": [<array of things to research>]
}

Return only the JSON object.`;

        const completion = await createChatCompletionWithRetry({
            messages: [{
                role: "system",
                content: "You are an expert career coach specializing in tech industry interview preparation."
            }, {
                role: "user",
                content: prompt
            }],
            max_tokens: 1500,
            temperature: 0.6,
            stream: false
        });

        let guide = completion.choices[0].message.content.trim();

        try {
            guide = JSON.parse(guide);
        } catch {
            // Fallback guide
            guide = {
                topics: ['Data structures', 'Algorithms', 'System design basics', 'Your experience'],
                commonQuestions: [
                    { question: 'Tell me about yourself', answer: 'Structure: Current role → Key achievements → Why interested' },
                    { question: 'Why this company?', answer: 'Research company values, products, and culture' }
                ],
                technicalConcepts: ['Time complexity', 'Space complexity', 'Common algorithms', 'Database design'],
                tips: ['Practice out loud', 'Use STAR method', 'Prepare questions to ask', 'Research the company'],
                companyResearch: ['Company products', 'Recent news', 'Company culture', 'Team structure']
            };
        }

        res.json({
            success: true,
            guide: guide,
            usage: completion.usage
        });

    } catch (error) {
        winston.error('Preparation guide error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate preparation guide'
        });
    }
});

// Get available time slots (mock data - can be connected to calendar system)
router.get('/available-slots', authenticateToken, async (req, res) => {
    try {
        const { date, type } = req.query;

        // Generate mock available slots
        const slots = [];
        const baseDate = date ? new Date(date) : new Date();

        // Generate slots for next 7 days
        for (let day = 0; day < 7; day++) {
            const slotDate = new Date(baseDate);
            slotDate.setDate(slotDate.getDate() + day);

            // Generate 3-5 slots per day
            const slotsPerDay = Math.floor(Math.random() * 3) + 3;
            for (let i = 0; i < slotsPerDay; i++) {
                const hour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
                const minute = [0, 30][Math.floor(Math.random() * 2)];

                slots.push({
                    id: `slot-${day}-${i}`,
                    date: slotDate.toISOString().split('T')[0],
                    time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
                    available: Math.random() > 0.3, // 70% available
                    type: type || 'behavioral',
                    duration: 60, // minutes
                    mentor: {
                        name: ['Sarah Chen', 'Mike Johnson', 'Emily Davis', 'David Lee'][Math.floor(Math.random() * 4)],
                        company: ['Google', 'Meta', 'Stripe', 'Atlassian'][Math.floor(Math.random() * 4)],
                        experience: '5+ years'
                    }
                });
            }
        }

        res.json({
            success: true,
            slots: slots.filter(s => s.available)
        });

    } catch (error) {
        winston.error('Get available slots error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get available slots'
        });
    }
});

// Book an interview session
router.post('/book-session', authenticateToken, async (req, res) => {
    try {
        const { slotId, packageId, type } = req.body;
        const user = req.user;

        if (!slotId) {
            return res.status(400).json({
                success: false,
                message: 'Slot ID is required'
            });
        }

        // In production, this would:
        // 1. Verify slot availability
        // 2. Create booking in database
        // 3. Send confirmation email
        // 4. Add to calendar

        const booking = {
            id: `booking-${Date.now()}`,
            userId: user.id,
            slotId: slotId,
            packageId: packageId || 'starter',
            type: type || 'behavioral',
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            session: {
                date: new Date().toISOString(),
                duration: 60,
                meetingLink: `https://meet.example.com/${Date.now()}`,
                recordingLink: null
            }
        };

        winston.info(`✅ Interview session booked: ${booking.id} for user ${user.email}`);

        res.json({
            success: true,
            booking: booking,
            message: 'Session booked successfully'
        });

    } catch (error) {
        winston.error('Book session error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book session'
        });
    }
});

// Get user's interview sessions
router.get('/my-sessions', authenticateToken, async (req, res) => {
    try {
        const user = req.user;

        // Mock sessions - in production, fetch from database
        const sessions = [
            {
                id: 'session-1',
                type: 'behavioral',
                date: new Date(Date.now() + 86400000).toISOString(),
                status: 'scheduled',
                mentor: { name: 'Sarah Chen', company: 'Google' }
            },
            {
                id: 'session-2',
                type: 'technical',
                date: new Date(Date.now() - 86400000).toISOString(),
                status: 'completed',
                mentor: { name: 'Mike Johnson', company: 'Meta' },
                feedback: {
                    score: 85,
                    strengths: ['Clear communication', 'Good technical knowledge'],
                    areasToImprove: ['More examples needed']
                }
            }
        ];

        res.json({
            success: true,
            sessions: sessions
        });

    } catch (error) {
        winston.error('Get sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get sessions'
        });
    }
});

// Get interview packages
router.get('/packages', async (req, res) => {
    try {
        const packages = [
            {
                id: 'starter',
                title: 'Starter Pack',
                sessions: 2,
                description: 'Focused feedback on communication and structure.',
                price: 79,
                features: [
                    '2 practice sessions',
                    'Recorded sessions',
                    'Detailed feedback',
                    'Action plan'
                ]
            },
            {
                id: 'career-sprint',
                title: 'Career Sprint',
                sessions: 5,
                description: 'Mix of behavioral, technical, and negotiation coaching.',
                price: 249,
                features: [
                    '5 practice sessions',
                    'All session types',
                    'Priority scheduling',
                    'Mentor matching',
                    'Comprehensive feedback'
                ]
            },
            {
                id: 'executive',
                title: 'Executive',
                sessions: 8,
                description: 'Leadership panel simulations with executive mentors.',
                price: 499,
                features: [
                    '8 practice sessions',
                    'Panel interviews',
                    'Executive mentors',
                    'Priority support',
                    'Customized coaching'
                ]
            }
        ];

        res.json({
            success: true,
            packages: packages
        });

    } catch (error) {
        winston.error('Get packages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get packages'
        });
    }
});

module.exports = router;




