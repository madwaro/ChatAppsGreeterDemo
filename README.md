# ChatAppDemo - OpenAI Apps SDK

A minimal **OpenAI Apps SDK** server implementing the Model Context Protocol (MCP) over HTTP with Server-Sent Events.

## What It Does

This MCP server exposes one tool:
- **greet** - Greets a person by name with a friendly message

The server implements the MCP protocol over HTTP at the `/mcp` endpoint, allowing ChatGPT to discover and call tools.

## Installation

```bash
npm install
npm run build
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on `http://localhost:3000` by default. Set the `PORT` environment variable to use a different port.

## Testing Locally

### With MCP Inspector
The easiest way to test your MCP server:

```bash
npx @modelcontextprotocol/inspector@latest --server-url http://localhost:3000/mcp --transport http
```

This opens a browser interface where you can test the `greet` tool.

### Manual Test
```bash
# Health check
curl http://localhost:3000/health
```

## Deploying with ngrok

For ChatGPT to access your server during development:

```bash
# Terminal 1: Start the server
npm start

# Terminal 2: Start ngrok with your domain
ngrok http 3000 --domain=unflanged-lashaunda-separately.ngrok-free.dev
```

## Adding to ChatGPT

1. Enable **developer mode** in ChatGPT:
   - Go to **Settings → Apps & Connectors → Advanced settings**
   - Enable "Developer mode"

2. Add a connector:
   - Go to **Settings → Connectors**
   - Click **Create**
   - Enter your URL: `https://unflanged-lashaunda-separately.ngrok-free.dev/mcp`
   - Name it "ChatAppDemo" and click **Create**

3. Use in a chat:
   - Open a new chat
   - Click **+** → **More** → Select your connector
   - Ask ChatGPT to greet someone (e.g., "Greet Alice")

## Project Structure

- **src/server/index.ts** - MCP server implementation
- **dist/server/index.js** - Compiled JavaScript (after build)

## How It Works

This server implements the MCP protocol:

1. **MCP Endpoint** (`/mcp`) - Handles POST, GET, DELETE requests from ChatGPT
2. **Server-Sent Events** - Streams responses back to the client
3. **Tool Registration** - Uses `registerAppTool` to define the `greet` tool
4. **Stateless Mode** - Each request creates a fresh server instance

## Tools Available

### greet
Greets a person by name with a friendly message.

**Input:**
```json
{
  "name": "string (required)"
}
```

**Output:**
```
Hello, {name}! Welcome to the ChatAppDemo. 👋
```

## Architecture

Built with the official MCP SDK:
- **@modelcontextprotocol/sdk** - Core MCP protocol implementation
- **@modelcontextprotocol/ext-apps** - Apps SDK helpers for tool registration
- **StreamableHTTPServerTransport** - HTTP/SSE transport layer
- **Zod** - Input validation
- **TypeScript** - Type-safe development

## Learn More

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Apps SDK Examples](https://github.com/openai/openai-apps-sdk-examples)

