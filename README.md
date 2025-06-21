# MongoDB MCP Chat

A modern, chat-based interface for MongoDB that enables natural language interactions with your database. This project leverages the MongoDB Model Context Protocol (MCP) to provide an intuitive way to manage and query MongoDB databases through conversational AI.

## Overview

MongoDB MCP Chat is an attempt to revolutionize database management by allowing users to interact with MongoDB using natural language. Instead of writing complex queries or navigating through traditional database management tools, users can simply chat with an AI interface to perform database operations.

## Features

- 🤖 Natural Language Interface: Interact with MongoDB using plain English
- 💬 Chat-based UI: Modern, intuitive interface built with React and Vite
- 🔌 MCP Integration: Leverages MongoDB's Model Context Protocol for intelligent interactions
- 🚀 Real-time Results: Immediate feedback and query results
- 🎯 Precise Control: AI-powered understanding of database operations

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/            # Source code
│   └── public/         # Static assets
└── server/             # Backend Node.js server
    └── src/            # Server source code
        ├── ai.ts       # AI processing logic
        ├── mcp.ts      # MongoDB MCP integration
        └── types.ts    # TypeScript type definitions
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB instance
- OpenAI API key
- MongoDB MCP endpoint

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3001

# OpenAI Configuration
OPENAI_API_KEY=your_api_key

# MongoDB MCP Configuration
MCP_API_KEY=your_mcp_api_key
MCP_ENDPOINT=your_mcp_endpoint
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Start the development servers:
   ```bash
   # Start the backend server
   cd server
   npm run dev

   # Start the frontend client
   cd ../client
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the MIT License.

## Acknowledgments

- MongoDB team for the Model Context Protocol
- OpenAI for their powerful language models
- React and Vite communities for excellent development tools
