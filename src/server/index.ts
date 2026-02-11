#!/usr/bin/env node

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";

const port = Number(process.env.PORT ?? 3000);
const MCP_PATH = "/mcp";

// Load the bundled UI
const greetingHtml = readFileSync("public/index.html", "utf8");

// Schema for greeting
const greetInputSchema = {
  name: z.string().min(1).describe("The name of the person to greet"),
};

// Multilingual greeting templates
const GREETINGS = [
  // English - Casual/Friendly
  "Hey {name}, great to see you! 👋",
  "What's up, {name}? Welcome aboard! 🚀",
  "Yo {name}! Let's get this party started! 🎉",
  "Howdy {name}! Ready for an awesome day? 🌟",
  "Hi there {name}! So glad you're here! 💫",
  
  // English - Funny/Playful
  "Well well well, look who it is... {name}! 😎",
  "Alert! {name} has entered the chat! 🚨",
  "{name}! You absolute legend! 🏆",
  "Greetings earthling {name}! 👽",
  "Beep boop! {name} detected! 🤖",
  
  // Spanish
  "¡Hola {name}! ¡Qué alegría verte! 🎊",
  "¡Saludos {name}! ¡Bienvenido! 🌺",
  "¡Ey {name}! ¡Vamos a pasarla genial! 🎈",
  "¡Buenos días {name}! ¿Qué tal? ☀️",
  "¡Qué onda {name}! ¡Listo para la aventura! 🌮",
  "¡Hola compadre {name}! ¡A darle! 💪",
  
  // Portuguese
  "Oi {name}! Que bom te ver! 🌻",
  "E aí {name}? Bem-vindo! 🎵",
  "Olá {name}! Vamos nessa! 💫",
  "Epa {name}! Tudo bem? 🌴",
  "Opa {name}! Bora lá! 🎸",
  "Salve {name}! Partiu! 🏖️",
  
  // Mandarin (Chinese Characters)
  "你好 {name}！很高兴见到你！🎋",
  "嘿 {name}！欢迎欢迎！🏮",
  "嗨 {name}！一起加油吧！✨",
  "{name} 你来啦！太好了！🎊",
  "哈喽 {name}！准备好了吗？🚀",
  
  // Mandarin (Pinyin)
  "Nǐ hǎo {name}! Hěn gāoxìng jiàn dào nǐ! 🎋",
  "Hēi {name}! Huānyíng huānyíng! 🏮",
  "Hāi {name}! Yīqǐ jiāyóu ba! ✨",
  "{name} nǐ lái la! Tài hǎo le! 🎊",
  "Hā lóu {name}! Zhǔnbèi hǎo le ma? 🚀",
];

function getRandomGreeting(name: string): string {
  const template = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  return template.replace("{name}", name);
}

function createGreetingServer() {
  const server = new McpServer({ name: "chatappdemo", version: "1.0.0" });

  // Register the UI resource
  registerAppResource(
    server,
    "greeting-widget",
    "ui://widget/greeting.html",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://widget/greeting.html",
          mimeType: RESOURCE_MIME_TYPE,
          text: greetingHtml,
        },
      ],
    })
  );

  // Register the greet tool with UI
  registerAppTool(
    server,
    "greet",
    {
      title: "Greet Person",
      description: "Greets a person by name with a friendly message.",
      inputSchema: greetInputSchema,
      _meta: {
        ui: { resourceUri: "ui://widget/greeting.html" },
      },
    },
    async (args) => {
      const name = args?.name?.trim?.() ?? "";
      if (!name) {
        return {
          content: [{ type: "text", text: "Please provide a name to greet." }],
        };
      }

      const greeting = getRandomGreeting(name);

      return {
        content: [
          {
            type: "text",
            text: greeting,
          },
        ],
        structuredContent: {
          name,
          greeting,
          timestamp: new Date().toISOString(),
        },
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
