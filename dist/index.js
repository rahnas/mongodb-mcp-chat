"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// Always load the root .env file
(0, dotenv_1.config)({ path: require('path').resolve(__dirname, '../../.env') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const ai_1 = require("./ai");
const mcp_1 = require("./mcp");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Routes
const analyze = async (req, res, next) => {
    try {
        const { question } = req.body;
        if (!question) {
            res.status(400).json({ error: 'Question is required' });
            return;
        }
        // Generate MCP query from natural language
        const queryResult = await (0, ai_1.generateMCPQuery)(question);
        // Execute the query against MongoDB MCP
        const mcpResponse = await (0, mcp_1.executeMCPQuery)(queryResult.mcpQuery);
        if (!mcpResponse.success) {
            res.status(500).json({ error: mcpResponse.error || 'Failed to execute MCP query' });
            return;
        }
        // Analyze the results
        const insights = await (0, ai_1.analyzeResults)(question, mcpResponse.data);
        res.json({
            query: queryResult.mcpQuery,
            data: mcpResponse.data,
            insights,
        });
    }
    catch (error) {
        next(error);
    }
};
app.post('/api/analyze', analyze);
// Health check
const healthCheck = (_req, res) => {
    res.json({ status: 'OK' });
};
app.get('/health', healthCheck);
// Error handler
app.use((err, _req, res, _next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to process the request' });
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
