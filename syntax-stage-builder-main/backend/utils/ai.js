const OpenAI = require('openai');
const winston = require('winston');

// Initialize OpenAI/OpenRouter
const apiKey = process.env.OPENAI_API_KEY;
const isOpenRouter = apiKey?.startsWith('sk-or-v1-') || process.env.USE_OPENROUTER === 'true';

const config = {
    apiKey: apiKey
};

if (isOpenRouter) {
    config.baseURL = 'https://openrouter.ai/api/v1';
    config.defaultHeaders = {
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://codeacademy-pro.vercel.app',
        'X-Title': 'CodeAcademy Pro'
    };
}

const openai = new OpenAI(config);

// Fallback models sequence for OpenRouter/OpenAI
const FALLBACK_MODELS = isOpenRouter ? [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "google/gemini-flash-1.5:free"
] : ["gpt-3.5-turbo"];

/**
 * Creates a chat completion with retry logic and model fallback.
 * @param {Array} messages - Direct messages array for OpenAI
 * @param {Object} options - Additional OpenAI completion options
 * @returns {Promise<Object>} - The completion response and the model used
 */
async function createChatCompletionWithRetry(messages, options = {}) {
    let lastError = null;
    const maxRetries = 1;

    for (const model of FALLBACK_MODELS) {
        let retries = 0;
        while (retries <= maxRetries) {
            try {
                winston.info(`Attempting completion with model: ${model} (Retry: ${retries})`);
                const completion = await openai.chat.completions.create({
                    model: model,
                    messages: messages,
                    max_tokens: options.max_tokens || 1000,
                    temperature: options.temperature || 0.7,
                    stream: false
                });

                return {
                    completion,
                    modelUsed: model
                };
            } catch (error) {
                lastError = error;
                const errorStatus = error.status || error.statusCode;
                const errorMessage = error.message || "";

                // Detection for daily free quota
                const isQuotaExceeded = errorMessage.toLowerCase().includes("free-models-per-day") ||
                    errorMessage.toLowerCase().includes("quota exceeded");

                if (isQuotaExceeded) {
                    winston.warn(`Daily free quota hit for OpenRouter. Skipping further models.`);
                    throw new Error("FREE_QUOTA_EXCEEDED: You've hit the daily limit for free AI models on OpenRouter. Please try again later or add credits to your OpenRouter account.");
                }

                // If 404 (Not Found), it's likely a dead endpoint, skip to next model
                if (errorStatus === 404) {
                    winston.warn(`Model ${model} returned 404 Not Found. Skipping to next model in chain.`);
                    break;
                }

                // If 429 (Rate Limit) or 500+, retry then fallback
                if (errorStatus === 429 || errorStatus >= 500) {
                    winston.warn(`Model ${model} failed with status ${errorStatus}. Error: ${errorMessage}`);
                    retries++;
                    if (retries <= maxRetries) {
                        const delay = Math.pow(2, retries) * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                } else {
                    // Other errors (401, 400), don't retry same model, try next one
                    winston.error(`Critical error with model ${model}: ${errorMessage}`);
                    break;
                }
            }
        }
    }

    throw lastError || new Error("All models failed to respond.");
}

module.exports = {
    openai,
    createChatCompletionWithRetry
};
