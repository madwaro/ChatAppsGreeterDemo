# Copilot Instructions for ChatAppDemo MCP Server

## Project Overview

This is a Model Context Protocol (MCP) server implementation designed to provide chat app demo tools. The project uses TypeScript and Express.js, built on the MCP SDK (`@modelcontextprotocol/sdk` and `@modelcontextprotocol/ext-apps`).

## Build and Development

### Build
```bash
npm run build
```
Compiles TypeScript from `src/` to `dist/` using the TypeScript compiler.

### Package Structure
- **Source**: `src/server/` - TypeScript source files
- **Output**: `dist/server/` - Compiled JavaScript (not committed to version control)
- **Entry point**: `dist/index.js` (referenced as `appdemo-mcp` binary in package.json)

## Architecture

### MCP Server Implementation
- Uses `@modelcontextprotocol/sdk` for core MCP functionality
- Uses `@modelcontextprotocol/ext-apps` for extended app capabilities
- Express.js server for HTTP endpoints
- Zod for schema validation

### Module System
- **Type**: ES Modules (`"type": "module"` in package.json)
- **Target**: ES2022
- **Module Resolution**: Node16
- TypeScript strict mode enabled

## Key Conventions

### TypeScript Configuration
- Strict mode is enabled - all code must satisfy strict TypeScript checks
- Output directory is `dist/`, source root is `src/`
- ES Module interop is enabled for compatibility with CommonJS modules

### Dependencies
- Express 5.x (latest major version)
- Zod 4.x for runtime schema validation
- All MCP-related packages should use compatible versions with the SDK

### File Structure
- Server implementation goes in `src/server/`
- The main entry point is `src/server/index.ts`
- Build output follows the same structure in `dist/server/`
