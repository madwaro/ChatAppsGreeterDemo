#!/usr/bin/env node

import express from "express";
import cors from "cors";
import { z } from "zod";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Schema for greeting
const GreetingSchema = z.object({
  name: z.string(),
});

// ChatGPT Apps endpoint - Server-Sent Events
app.get("/.well-known/ai-plugin.json", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send app manifest as SSE
  const manifest = {
    schema_version: "v1",
    name_for_human: "ChatAppDemo",
    name_for_model: "chatappdemo",
    description_for_human: "A simple greeting app that says hello.",
    description_for_model: "Use this app to greet people by name with a friendly message.",
    auth: {
      type: "none",
    },
    api: {
      type: "openapi",
      url: `${req.get("x-forwarded-proto") || req.protocol}://${req.get("host")}/openapi.json`,
    },
    logo_url: `${req.get("x-forwarded-proto") || req.protocol}://${req.get("host")}/logo.png`,
    contact_email: "support@example.com",
    legal_info_url: `${req.get("x-forwarded-proto") || req.protocol}://${req.get("host")}/legal`,
  };

  res.write(`data: ${JSON.stringify(manifest)}\n\n`);
  res.end();
});

// POST /greet - Main action endpoint
app.post("/greet", (req, res) => {
  try {
    const { name } = GreetingSchema.parse(req.body);
    
    res.json({
      message: `Hello, ${name}! Welcome to the ChatAppDemo. 👋`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// GET /openapi.json - OpenAPI specification
app.get("/openapi.json", (req, res) => {
  const host = req.get("host") || `localhost:${PORT}`;
  
  res.json({
    openapi: "3.0.0",
    info: {
      title: "ChatAppDemo API",
      description: "A simple greeting API for ChatGPT",
      version: "1.0.0",
    },
    servers: [
      {
        url: `${req.get("x-forwarded-proto") || req.protocol}://${host}`,
      },
    ],
    paths: {
      "/greet": {
        post: {
          operationId: "greetPerson",
          summary: "Greet a person by name",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the person to greet",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful greeting",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        description: "The greeting message",
                      },
                      timestamp: {
                        type: "string",
                        format: "date-time",
                        description: "When the greeting was generated",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Placeholder for logo
app.get("/logo.png", (req, res) => {
  res.status(404).send("Logo not implemented");
});

// Placeholder for legal
app.get("/legal", (req, res) => {
  res.send("Legal information not implemented");
});

// Start server
app.listen(PORT, () => {
  console.log(`ChatAppDemo HTTP server running on http://localhost:${PORT}`);
  console.log(`App manifest: http://localhost:${PORT}/.well-known/ai-plugin.json`);
  console.log(`OpenAPI spec: http://localhost:${PORT}/openapi.json`);
});
