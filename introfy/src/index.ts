import express, { Request, Response } from "express";

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
