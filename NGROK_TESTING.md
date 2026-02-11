# Testing with ngrok

## Setup

1. Start the server locally:
```bash
npm start
```

2. In another terminal, start ngrok:
```bash
ngrok http 3000
```

Or if you have a specific domain:
```bash
ngrok http 3000 --domain=unflanged-lashaunda-separately.ngrok-free.dev
```

## Testing the Plugin

### Verify the manifest
```bash
curl https://unflanged-lashaunda-separately.ngrok-free.dev/.well-known/ai-plugin.json
```

### Test the API
```bash
curl -X POST https://unflanged-lashaunda-separately.ngrok-free.dev/greet \
  -H "Content-Type: application/json" \
  -d '{"name": "ChatGPT"}'
```

## Using with ChatGPT

1. Go to ChatGPT
2. Navigate to: Settings → Beta Features → Enable "Plugins"
3. In the Plugin Store, click "Develop your own plugin"
4. Enter your ngrok URL: `https://unflanged-lashaunda-separately.ngrok-free.dev`
5. ChatGPT will fetch the manifest and install your plugin

The AI will now be able to use the `greetPerson` operation to greet people!
