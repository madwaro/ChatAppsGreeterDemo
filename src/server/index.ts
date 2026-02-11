#!/usr/bin/env node

import { createServer } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";

const port = Number(process.env.PORT ?? 3000);
const MCP_PATH = "/mcp";

// Schema for greeting
const greetInputSchema = {
  name: z.string().min(1).describe("The name of the person to greet"),
};

function createGreetingServer() {
  const server = new McpServer({ name: "chatappdemo", version: "1.0.0" });

  registerAppTool(
    server,
    "greet",
    {
      title: "Greet Person",
      description: "Greets a person by name with a friendly message.",
      inputSchema: greetInputSchema,
      _meta: {}, // Required for app tools, even if empty
    },
    async (args) => {
      const name = args?.name?.trim?.() ?? "";
      if (!name) {
        return {
          content: [{ type: "text", text: "Please provide a name to greet." }],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Hello, ${name}! Welcome to the ChatAppDemo. 👋`,
          },
        ],
      };
    }
  );

  return server;
}

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    });
    res.end();
    return;
  }

  // Health check
  if (req.method === "GET" && url.pathname === "/") {
    res
      .writeHead(200, { "content-type": "text/plain" })
      .end("ChatAppDemo MCP server");
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    res
      .writeHead(200, { "content-type": "application/json" })
      .end(JSON.stringify({ status: "ok" }));
    return;
  }

  // Handle MCP requests
  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    const server = createGreetingServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.writeHead(500).end("Internal server error");
      }
    }
    return;
  }

  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(`ChatAppDemo MCP server running on http://localhost:${port}`);
  console.log(`MCP endpoint: http://localhost:${port}${MCP_PATH}`);
  console.log(`Health check: http://localhost:${port}/health`);
});
