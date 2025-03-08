import { z } from "zod";

export const StagehandParamSchema = z.object({
  name: z.string(),
  type: z.enum(["number", "string", "enum"]),
  description: z.string(),
});

export const StagehandInstructionSchema = z.object({
  type: z.enum(["observe", "goto", "extract", "act"]),
  action: z.string(),
  variables: z.record(z.string()),
});

export const StagehandResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  params: z.array(StagehandParamSchema),
  instructions: z.array(StagehandInstructionSchema),
  expectedResult: z.any(), // Since this is a ZodType itself, we'll validate it separately
});
