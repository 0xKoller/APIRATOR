/**
 * Express server that exposes an endpoint to run Stagehand automation
 */
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Stagehand } from "@browserbasehq/stagehand";
import { StageHandLocalConfig } from "./stagehand.config.js";
import { main } from "./main.js";
import chalk from "chalk";
import boxen from "boxen";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Endpoint to run the main Stagehand function
app.post("/run", async (req, res) => {
  try {
    console.log("Starting Stagehand automation...");

    const stagehand = new Stagehand({
      ...StageHandLocalConfig,
    });

    await stagehand.init();

    if (
      StageHandLocalConfig.env === "BROWSERBASE" &&
      stagehand.browserbaseSessionID
    ) {
      console.log(
        boxen(
          `View this session live in your browser: \n${chalk.blue(
            `https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`
          )}`,
          {
            title: "Browserbase",
            padding: 1,
            margin: 3,
          }
        )
      );
    }

    const page = stagehand.page;
    const context = stagehand.context;

    // Run the main function with custom parameters from the request if provided
    await main({
      page,
      context,
      stagehand,
      ...req.body,
    });

    await stagehand.close();

    res.status(200).json({
      success: true,
      message: "Stagehand automation completed successfully",
    });
  } catch (error: any) {
    console.error("Error running Stagehand automation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to run Stagehand automation",
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 POST to /run to execute Stagehand automation`);
});
