import express from "express";
import cors from "cors";
import config from "./config/env";
import linkedinRoutes from "./routes/linkedinRoutes";
import unipileRoutes from "./routes/unipile.routes";
const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/unipile", unipileRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
