# ChatAppDemo - OpenAI Apps SDK with React UI

A minimal **OpenAI Apps SDK** server implementing the Model Context Protocol (MCP) over HTTP with a **custom React UI** for greeting.

## What It Does

This MCP server exposes one tool with a custom UI:
- **greet** - Greets a person by name with a friendly animated UI component

### UI Features
- 👋 **Animated emoji** that waves at you
- **Personalized greeting** with the person's name
- **Slowly moving gradient background** with calm pastel colors
- **Glassmorphic card design** with smooth animations

The UI is built with React and bundled into a single HTML file served via MCP resources.

## Installation

```bash
npm install
npm run build
```

## Running the Server

### Development

```bash
# Run server only
npm run dev

# Run UI development server (for testing UI separately)
npm run dev:ui
```

### Production
```bash
npm start
```

The server will run on `http://localhost:3000` by default. Set the `PORT` environment variable to use a different port.

## Building

```bash
# Build everything (UI + Server)
npm run build

# Build UI only
npm run build:ui

# Build server only
npm run build:server
```

The build process:
1. Bundles the React UI into a single HTML file (`public/index.html`)
2. Compiles TypeScript server code to JavaScript (`dist/server/`)

## Testing Locally

### With MCP Inspector
The easiest way to test your MCP server and see the UI:

```bash
npx @modelcontextprotocol/inspector@latest --server-url http://localhost:3000/mcp --transport http
```

This opens a browser interface where you can:
- Test the `greet` tool
- See the custom React UI render inline
- View the animated gradient background

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
   - **The custom UI will appear inline!**

## Project Structure

```
ChatAppDemo/
├── src/
│   ├── server/
│   │   └── index.ts        # MCP server implementation
│   └── ui/
│       ├── App.tsx         # React greeting component
│       ├── App.css         # Styles with animations
│       ├── main.tsx        # React entry point
│       └── index.html      # HTML template
├── public/
│   └── index.html          # Bundled single-file UI (generated)
├── dist/
│   └── server/
│       └── index.js        # Compiled server (generated)
├── vite.config.ts          # Vite bundler config
└── package.json
```

## How It Works

### MCP Protocol

1. **MCP Endpoint** (`/mcp`) - Handles POST, GET, DELETE requests from ChatGPT
2. **Server-Sent Events** - Streams responses back to the client
3. **Tool Registration** - Uses `registerAppTool` to define the `greet` tool
4. **UI Resource** - Uses `registerAppResource` to serve the React UI
5. **Stateless Mode** - Each request creates a fresh server instance

### UI Component

The React UI implements the MCP Apps standard bridge:
- Initializes with `ui/initialize` JSON-RPC request
- Sends `ui/notifications/initialized` notification when ready
- Listens for `ui/notifications/tool-result` to receive greeting data
- Updates displayed name dynamically based on structured content

### Tool Response Format

```typescript
{
  content: [
    { type: "text", text: "Hello, Alice! Welcome to ChatAppDemo. 👋" }
  ],
  structuredContent: {
    name: "Alice",
    timestamp: "2024-02-11T22:10:00.000Z"
  }
}
```

The `structuredContent` is sent to the UI via notifications, allowing it to update dynamically.

## Tools Available

### greet
Greets a person by name with a custom animated UI.

**Input:**
```json
{
  "name": "string (required)"
}
```

**Output:**
- Text message
- Custom React UI with:
  - Waving emoji animation
  - Personalized greeting
  - Animated gradient background (15s loop)
  - Glassmorphic card design

## Architecture

Built with:
- **@modelcontextprotocol/sdk** - Core MCP protocol implementation
- **@modelcontextprotocol/ext-apps** - Apps SDK helpers for tool/resource registration
- **StreamableHTTPServerTransport** - HTTP/SSE transport layer
- **React** - UI component library
- **Vite** - Fast build tool with single-file bundling
- **Zod** - Input validation
- **TypeScript** - Type-safe development

## Customizing the UI

To modify the UI:

1. Edit `src/ui/App.tsx` and `src/ui/App.css`
2. Run `npm run dev:ui` to see changes in real-time
3. Rebuild with `npm run build:ui`
4. Restart the server with `npm start`

### Changing Colors

The gradient uses these colors (in `App.css`):
```css
#e0c3fc (lavender)
#8ec5fc (sky blue)
#b8e0d2 (mint)
#d6a4e8 (purple)
#fbc2eb (pink)
#a6c1ee (periwinkle)
```

Adjust these in the `.gradient-bg` selector to change the color scheme.

## Learn More

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Apps SDK Examples](https://github.com/openai/openai-apps-sdk-examples)
- [React Documentation](https://react.dev)

