const Bytez = require('bytez.js');
const winston = require('winston');

// Initialize Bytez SDK
const bytezApiKey = process.env.BYTEZ_API_KEY || '1800a62d923ab9a5b2f420fbc8b762a0';
const sdk = new Bytez(bytezApiKey);

// Default model configuration
const DEFAULT_MODEL = process.env.BYTEZ_MODEL || 'openai/gpt-4o-mini';

/**
 * Creates a chat completion using Bytez.js
 * @param {Array} messages - Messages array in OpenAI format
 * @param {Object} options - Additional options (max_tokens, temperature)
 * @returns {Promise<Object>} - The completion response and model used
 */
async function createChatCompletionWithRetry(messages, options = {}) {
    try {
        winston.info(`Creating chat completion with Bytez model: ${DEFAULT_MODEL}`);

        // Get the model instance
        const model = sdk.model(DEFAULT_MODEL);

        // Run the model with messages
        const { error, output } = await model.run(messages, {
            max_tokens: options.max_tokens || 1000,
            temperature: options.temperature || 0.7
        });

        if (error) {
            winston.error('Bytez API error:', error);
            throw new Error(error.message || 'Bytez API request failed');
        }

        // Format response to match OpenAI structure for compatibility
        const completion = {
            choices: [
                {
                    message: {
                        content: output.content || output,
                        role: 'assistant'
                    }
                }
            ],
            usage: output.usage || {}
        };

        return {
            completion,
            modelUsed: DEFAULT_MODEL
        };

    } catch (error) {
        winston.error('Bytez chat completion error:', error);

        // If Bytez fails, throw a user-friendly error
        throw {
            status: error.status || 500,
            message: error.message || 'AI service temporarily unavailable. Please try again.'
        };
    }
}

/**
 * Legacy OpenAI client export (for backwards compatibility)
 * This is a minimal wrapper that uses Bytez under the hood
 */
const openai = {
    chat: {
        completions: {
            create: async (params) => {
                const { error, output } = await sdk.model(DEFAULT_MODEL).run(params.messages);

                if (error) throw new Error(error.message || 'API request failed');

                return {
                    choices: [
                        {
                            message: {
                                content: output.content || output,
                                role: 'assistant'
                            }
                        }
                    ]
                };
            }
        }
    }
};

module.exports = {
    openai,
    createChatCompletionWithRetry,
    sdk // Export Bytez SDK for direct access if needed
};
