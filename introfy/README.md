# Introfy

A simple Node.js Express TypeScript server with a health check endpoint.

## Installation

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

## Building for Production

To build the project:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## API Endpoints

- `GET /health`: Health check endpoint that returns a 200 OK response with a JSON body `{ "status": "OK" }`

## Environment Variables

- `PORT`: The port number on which the server will listen (default: 3000)
