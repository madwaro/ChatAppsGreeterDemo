# ChatAppDemo MCP Server

A minimal Model Context Protocol (MCP) server demonstrating basic tool functionality.

## What It Does

This server exposes a simple `greet` tool that returns a personalized greeting message.

## Installation

```bash
npm install
npm run build
```

## Running the Server

The MCP server communicates over stdio and is designed to be used with MCP clients like Claude Desktop or other MCP-compatible applications.

### Test Locally

You can test the server by running it directly:

```bash
node dist/server/index.js
```

### Configure with Claude Desktop

Add this to your Claude Desktop MCP configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "chatappdemo": {
      "command": "node",
      "args": ["/path/to/ChatAppDemo/dist/server/index.js"]
    }
  }
}
```

Replace `/path/to/ChatAppDemo` with the actual path to this project.

## Available Tools

### greet

Greets a person by name with a friendly hello message.

**Parameters:**
- `name` (string, required): The name to greet

**Example:**
```json
{
  "name": "greet",
  "arguments": {
    "name": "Alice"
  }
}
```

**Response:**
```
Hello, Alice! Welcome to the ChatAppDemo MCP server. 👋
```

## Development

- **Source code**: `src/server/index.ts`
- **Build**: `npm run build`
- **Output**: `dist/server/index.js`

## Architecture

This is a standard MCP server that:
1. Uses stdio transport for communication
2. Implements tool listing and tool calling handlers
3. Validates input using Zod schemas
4. Returns structured responses
