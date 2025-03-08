# APIRATOR Backend

This is a backend Express server that exposes an endpoint to run Stagehand automations.

## Setup

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```
npm install
```

4. Create a `.env` file based on `.env.example`

## Running the Application

### Development Mode (with hot reload)

```
npm run dev
```

This starts the server with nodemon, which automatically restarts the server when files change.

### Production Mode

```
npm run build
npm run start:server
```

## Available Endpoints

### Health Check

```
GET /health
```

Returns a simple status response to confirm the server is running.

### Run Stagehand Automation

```
POST /run
```

Executes the main Stagehand automation function and returns the result.

Example request:

```bash
curl -X POST http://localhost:3000/run \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Legacy Mode

To run the application in the original mode (without Express):

```
npm run start
```

## Environment Variables

- `PORT`: The port for the Express server (default: 3000)
- Other variables from `.env.example`

# 🤘 Welcome to Stagehand!

Hey! This is a project built with [Stagehand](https://github.com/browserbase/stagehand).

You can build your own web agent using: `npx create-browser-app`!

## Setting the Stage

Stagehand is an SDK for automating browsers. It's built on top of [Playwright](https://playwright.dev/) and provides a higher-level API for better debugging and AI fail-safes.

## Curtain Call

Get ready for a show-stopping development experience. Just run:

```bash
npm install && npm start
```

## What's Next?

### Add your API keys

Required API keys/environment variables are in the `.env.example` file. Copy it to `.env` and add your API keys.

```bash
cp .env.example .env && nano .env # Add your API keys to .env
```

### Custom .cursorrules

We have custom .cursorrules for this project. It'll help quite a bit with writing Stagehand easily.

### Run on Browserbase

To run on Browserbase, add your API keys to .env and change `env: "LOCAL"` to `env: "BROWSERBASE"` in [stagehand.config.ts](stagehand.config.ts).

### Use Anthropic Claude 3.5 Sonnet

1. Add your API key to .env
2. Change `modelName: "gpt-4o"` to `modelName: "claude-3-5-sonnet-latest"` in [stagehand.config.ts](stagehand.config.ts)
3. Change `modelClientOptions: { apiKey: process.env.OPENAI_API_KEY }` to `modelClientOptions: { apiKey: process.env.ANTHROPIC_API_KEY }` in [stagehand.config.ts](stagehand.config.ts)
