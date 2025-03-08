import { z } from "zod";

export interface StagehandParam {
  name: string;
  type: "number" | "string" | "enum";
  description: string;
}

export interface StagehandInstruction {
  type: "observe" | "goto" | "extract" | "act";
  action: string;
  variables: {
    [key: string]: string;
  };
}

export interface StagehandResponse {
  id: string;
  name: string;
  params: StagehandParam[];
  instructions: StagehandInstruction[];
  expectedResult: z.ZodType;
}
