# ChatAppDemo - OpenAI ChatGPT Actions Plugin

A minimal HTTP-based ChatGPT Actions plugin demonstrating the basic structure of an OpenAI plugin.

## What It Does

This server exposes a simple REST API endpoint:
- **POST /greet** - Greets a person by name with a friendly message

It includes all the required OpenAI plugin endpoints:
- `/.well-known/ai-plugin.json` - Plugin manifest
- `/openapi.json` - OpenAPI specification

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

## Testing the API

### Test the greeting endpoint
```bash
curl -X POST http://localhost:3000/greet \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'
```

**Response:**
```json
{
  "message": "Hello, Alice! Welcome to the ChatAppDemo. 👋",
  "timestamp": "2024-02-11T00:00:00.000Z"
}
```

### View the plugin manifest
```bash
curl http://localhost:3000/.well-known/ai-plugin.json
```

### View the OpenAPI specification
```bash
curl http://localhost:3000/openapi.json
```

## Using with ChatGPT

To use this plugin with ChatGPT:

1. Deploy your server to a publicly accessible HTTPS URL
2. In ChatGPT, go to Plugin Store → Develop your own plugin
3. Enter your domain (e.g., `https://yourdomain.com`)
4. ChatGPT will fetch `/.well-known/ai-plugin.json` and register your plugin

For local development, you can use tools like [ngrok](https://ngrok.com/) to expose your local server:

```bash
ngrok http 3000
```

## Project Structure

- **src/server/index.ts** - Main HTTP server with Express
- **dist/server/index.js** - Compiled JavaScript (after build)

## API Endpoints

### POST /greet
Greets a person by name.

**Request:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "message": "string",
  "timestamp": "ISO 8601 date-time"
}
```

### GET /.well-known/ai-plugin.json
Returns the plugin manifest for ChatGPT.

### GET /openapi.json
Returns the OpenAPI 3.0 specification for the API.

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Architecture

This is a standard HTTP REST API built with:
- **Express.js** - Web framework
- **Zod** - Input validation
- **TypeScript** - Type-safe development

