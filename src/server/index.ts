#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server(
  {
    name: "chatappdemo-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define the greeting tool schema
const GreetingArgsSchema = z.object({
  name: z.string().describe("The name to greet"),
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "greet",
        description: "Greets a person by name with a friendly hello message",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name to greet",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "greet") {
    const args = GreetingArgsSchema.parse(request.params.arguments);
    
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${args.name}! Welcome to the ChatAppDemo MCP server. 👋`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ChatAppDemo MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
