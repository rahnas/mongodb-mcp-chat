"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeMCPQuery = executeMCPQuery;
const sdk_1 = require("@modelcontextprotocol/sdk");
const MCP_API_KEY = process.env.MCP_API_KEY;
const MCP_ENDPOINT = process.env.MCP_ENDPOINT;
if (!MCP_API_KEY || !MCP_ENDPOINT) {
    throw new Error('Missing MongoDB MCP configuration');
}
// Initialize MCP client
const client = new sdk_1.McpClient({
    name: "atlas-mcp-to-chat-ui",
    version: "1.0.0"
});
async function executeMCPQuery(query) {
    try {
        // Connect to the MCP server
        await client.connect(MCP_ENDPOINT);
        // Prepare the tool request
        const toolRequest = {
            tool: "mongodb/find", // This is an example - adjust based on your query type
            params: {
                database: "ecommerce",
                collection: query.collection || "products",
                filter: query.filter || {},
                projection: query.projection,
                limit: query.limit || 10
            }
        };
        // Execute the query
        const response = await client.callTool(toolRequest);
        // Close the connection
        await client.close();
        return {
            success: true,
            data: response.result
        };
    }
    catch (error) {
        console.error('Error executing MCP query:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
