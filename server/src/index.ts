import { config } from 'dotenv';
// Always load the root .env file
config({ path: require('path').resolve(__dirname, '../../.env') });

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { generateMCPQuery, analyzeResults } from './ai';
import { executeMCPQuery } from './mcp';
import { AnalysisRequest } from './types';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const analyze = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { question } = req.body as AnalysisRequest;

    if (!question) {
      res.status(400).json({ error: 'Question is required' });
      return;
    }

    // Generate MCP query from natural language
    const queryResult = await generateMCPQuery(question);

    // Execute the query against MongoDB MCP
    const mcpResponse = await executeMCPQuery(queryResult.mcpQuery);

    if (!mcpResponse.success) {
      res.status(500).json({ error: mcpResponse.error || 'Failed to execute MCP query' });
      return;
    }

    // Analyze the results
    const insights = await analyzeResults(question, mcpResponse.data);

    res.json({
      query: queryResult.mcpQuery,
      data: mcpResponse.data,
      insights,
    });
  } catch (error) {
    next(error);
  }
};

app.post('/api/analyze', analyze);

// Health check
const healthCheck = (_req: Request, res: Response): void => {
  res.json({ status: 'OK' });
};

app.get('/health', healthCheck);

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Failed to process the request' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});