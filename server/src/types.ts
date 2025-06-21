export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface MCPQuery {
  collection: string;
  filter?: Record<string, any>;
  projection?: Record<string, any>;
  sort?: Record<string, any>;
  limit?: number;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface AIQueryResult {
  mcpQuery: MCPQuery;
  insights: string;
}

export interface AnalysisRequest {
  question: string;
  context?: any;
}