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
import { jsonSchemaToZod } from "json-schema-to-zod";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Endpoint to run the main Stagehand function
/**
 * @route POST /run
 * @description Executes a sequence of Stagehand instructions using the Stagehand API
 * @param {Object} req.body - Request body
 * @param {Array} [req.body.instructions] - Array of instructions to execute
 * @param {string} [req.body.instructions[].type] - Type of instruction: 'goto', 'act', 'extract', or 'observe'
 * @param {string} [req.body.instructions[].action] - The instruction string or URL (for goto)
 * @param {Object} [req.body.instructions[].options] - Additional options for the Stagehand method
 *
 * @example
 * // Example payload using Stagehand API
 * {
 *   "instructions": [
 *     {
 *       "type": "goto",
 *       "action": "https://example.com/login",
 *       "options": {
 *         "waitUntil": "networkidle"
 *       }
 *     },
 *     {
 *       "type": "act",
 *       "action": "fill in the form with %username% and %password%",
 *       "options": {
 *         "variables": {
 *           "username": "john.doe",
 *           "password": "secretpass123"
 *         }
 *       }
 *     },
 *     {
 *       "type": "act",
 *       "action": "click the sign in button"
 *     },
 *     {
 *       "type": "observe",
 *       "options": {
 *         "instruction": "find all product links on the dashboard",
 *         "onlyVisible": true
 *       }
 *     },
 *     {
 *       "type": "extract",
 *       "options": {
 *         "instruction": "extract the welcome message",
 *         "useTextExtract": true
 *       }
 *     },
 *     {
 *       "type": "extract",
 *       "options": {
 *         "instruction": "extract product information from the page",
 *         "schema": {
 *           "type": "object",
 *           "properties": {
 *             "productName": { "type": "string" },
 *             "price": { "type": "number" },
 *             "inStock": { "type": "boolean" },
 *             "categories": { "type": "array", "items": { "type": "string" } }
 *           },
 *           "required": ["productName", "price"]
 *         },
 *         "useTextExtract": true
 *       }
 *     }
 *   ]
 * }
 *
 * @note For the 'extract' method, you can provide a JSON Schema object in the schema field.
 *       This will be automatically converted to a Zod schema that Stagehand requires.
 *
 *       Example JSON Schema:
 *       {
 *         "type": "object",
 *         "properties": {
 *           "name": { "type": "string" },
 *           "price": { "type": "number" },
 *           "tags": { "type": "array", "items": { "type": "string" } }
 *         },
 *         "required": ["name", "price"]
 *       }
 *
 * @returns {Object} res - Response object
 * @returns {boolean} res.success - Whether the operation was successful
 * @returns {string} res.message - Message describing the result
 * @returns {Array} [res.results] - Results of each instruction
 */
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

    // Check if instructions array is provided
    if (req.body.instructions && Array.isArray(req.body.instructions)) {
      const results = [];

      // Process each instruction sequentially
      for (const instruction of req.body.instructions) {
        try {
          const { type, action, options = {} } = instruction;
          let result;

          // Execute the appropriate Stagehand method based on instruction type
          switch (type) {
            case "goto":
              // For goto, action is the URL and options may contain waitUntil, timeout, etc.
              await page.goto(action, options);
              result = { success: true, message: `Navigated to ${action}` };
              break;

            case "act":
              // Handle act method - can accept either a string or ActOptions
              if (
                typeof action === "string" &&
                Object.keys(options).length === 0
              ) {
                // Simple string case
                result = await page.act(action);
              } else {
                // ActOptions case
                result = await page.act({
                  action,
                  ...options,
                });
              }
              break;

            case "extract":
              // Handle extract method with JSON Schema support
              try {
                if (
                  typeof action === "string" &&
                  Object.keys(options).length === 0
                ) {
                  // Simple extraction with just an instruction string
                  result = await page.extract(action);
                } else if (options.instruction) {
                  // If the schema is provided as a JSON Schema object
                  if (options.schema && typeof options.schema === "object") {
                    try {
                      const { z } = await import("zod");

                      // Convert JSON Schema to Zod schema using json-schema-to-zod
                      const zodSchemaStr = jsonSchemaToZod(options.schema, {
                        module: "none", // Don't include imports or exports
                      });

                      // Create a function that evaluates the schema code and returns a Zod schema
                      const createZodSchema = new Function(
                        "z",
                        `
                        try {
                          return ${zodSchemaStr.trim()};
                        } catch (e) {
                          console.error("Error evaluating schema:", e);
                          return z.object({}).passthrough();
                        }
                      `
                      );

                      // Create the Zod schema using the generated code
                      const zodSchema = createZodSchema(z);

                      if (zodSchema) {
                        // Use the schema with extract
                        result = await page.extract({
                          ...options,
                          schema: zodSchema,
                        });
                      } else {
                        throw new Error(
                          "Failed to convert JSON schema to Zod schema"
                        );
                      }
                    } catch (error) {
                      console.warn(
                        `Error with JSON schema conversion: ${
                          error instanceof Error ? error.message : String(error)
                        }`
                      );
                      // Fall back to default extraction
                      const { schema, ...restOptions } = options;
                      result = await page.extract(restOptions);
                    }
                  } else {
                    // No schema provided, use default extraction
                    result = await page.extract(options);
                  }
                } else if (action) {
                  // If action provided but instruction not in options, use action as instruction
                  const extractOptions = {
                    instruction: action,
                    ...options,
                  };
                  result = await page.extract(extractOptions);
                } else {
                  throw new Error(
                    "Extract operation requires either action or options.instruction"
                  );
                }
              } catch (error) {
                throw new Error(
                  `Error in extract operation: ${
                    error instanceof Error ? error.message : String(error)
                  }`
                );
              }
              break;

            case "observe":
              // Handle observe method - can accept string or ObserveOptions
              if (
                typeof action === "string" &&
                Object.keys(options).length === 0
              ) {
                // Simple observation with just an instruction string
                result = await page.observe(action);
              } else if (options.instruction) {
                // ObserveOptions case with instruction in options
                result = await page.observe({
                  ...options,
                });
              } else if (action) {
                // If action provided but instruction not in options, use action as instruction
                result = await page.observe({
                  instruction: action,
                  ...options,
                });
              } else {
                // No instruction case - observe everything
                result = await page.observe(options);
              }
              break;

            default:
              throw new Error(`Unsupported instruction type: ${type}`);
          }

          results.push({
            type,
            action,
            result,
            success: true,
          });
        } catch (error: any) {
          results.push({
            type: instruction.type,
            action: instruction.action,
            success: false,
            error: error.message,
          });
        }
      }

      await stagehand.close();

      res.status(200).json({
        success: true,
        message: "Stagehand automation completed successfully",
        results,
      });
    } else {
      // Fall back to the main function if no instructions array is provided
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
    }
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
