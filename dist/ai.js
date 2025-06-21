"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMCPQuery = generateMCPQuery;
exports.analyzeResults = analyzeResults;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = require("dotenv");
const path_1 = require("path");
// Load environment variables
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../../.env') });
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
async function generateMCPQuery(question) {
    const messages = [
        {
            role: 'system',
            content: `You are a MongoDB MCP query generator. Convert natural language questions about eCommerce data into MongoDB MCP queries.
Available collections:
- orders (fields: total, createdAt, customerId, items)
- customers (fields: name, email, totalSpent)
- products (fields: name, sku, price, soldCount)
Format your response as a valid JSON object with two properties:
1. mcpQuery: The MongoDB MCP query object
2. insights: A brief explanation of what the query will return`
        },
        {
            role: 'user',
            content: question
        }
    ];
    const completion = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: messages.map(({ role, content }) => ({ role, content })),
        temperature: 0.2,
        response_format: { type: 'json_object' }
    });
    const content = completion.choices[0].message.content;
    if (!content) {
        throw new Error('No response from OpenAI');
    }
    const result = JSON.parse(content);
    return result;
}
async function analyzeResults(question, data) {
    try {
        const messages = [
            {
                role: 'system',
                content: 'You are an AI assistant that analyzes MongoDB query results and provides insights in natural language.'
            },
            {
                role: 'user',
                content: `Question: ${question}\n\nData: ${JSON.stringify(data, null, 2)}\n\nProvide a natural language summary of these results.`
            }
        ];
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages,
            temperature: 0.7,
            max_tokens: 500
        });
        return completion.choices[0].message.content || 'No insights available.';
    }
    catch (error) {
        console.error('Error analyzing results:', error);
        return 'Failed to analyze the results.';
    }
}
