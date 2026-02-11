# ChatAppDemo - ChatGPT App

A minimal HTTP-based **ChatGPT App** (the new @-mention system) demonstrating the basic structure.

## What It Does

This server exposes a simple REST API endpoint:
- **POST /greet** - Greets a person by name with a friendly message

It includes the required ChatGPT App endpoints:
- `/.well-known/ai-plugin.json` - App manifest (Server-Sent Events format)
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

## Testing with ngrok

See [NGROK_TESTING.md](./NGROK_TESTING.md) for detailed instructions.

Quick start:
```bash
# Terminal 1: Start the server
npm start

# Terminal 2: Start ngrok
ngrok http 3000 --domain=your-domain.ngrok-free.dev
```

## Adding to ChatGPT

1. Go to ChatGPT (chat.openai.com)
2. Click on your profile → Settings → Apps
3. Click "Add App" or "Connect App"
4. Enter your ngrok URL: `https://your-domain.ngrok-free.dev/.well-known/ai-plugin.json`
5. ChatGPT will fetch the manifest and install your app

You can then use the app by typing `@ChatAppDemo` in your chat!

## Testing the API

### Test the greeting endpoint
```bash
curl -X POST https://your-domain.ngrok-free.dev/greet \
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

### View the app manifest (SSE format)
```bash
curl https://your-domain.ngrok-free.dev/.well-known/ai-plugin.json
```

### View the OpenAPI specification
```bash
curl https://your-domain.ngrok-free.dev/openapi.json
```

## Project Structure

- **src/server/index.ts** - Main HTTP server with Express
- **dist/server/index.js** - Compiled JavaScript (after build)

## API Endpoints

### GET /.well-known/ai-plugin.json
Returns the app manifest using Server-Sent Events (SSE) format.

**Response Headers:**
- `Content-Type: text/event-stream`

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

This is a ChatGPT App built with:
- **Express.js** - Web framework
- **Server-Sent Events** - For app manifest delivery
- **Zod** - Input validation
- **TypeScript** - Type-safe development
- **CORS** - Enabled for ChatGPT access

