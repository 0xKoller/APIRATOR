import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export class AIService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
  }

  async compareICPWithLinkedinProfile(icp: any, linkedinProfile: any) {
    const { object } = await generateObject({
      model: openai("o3-mini"),
      schema: z.object({
        results: z.object({
          matchScore: z.number(),
          matchReason: z.string(),
        }),
      }),
      prompt: `Compare the ICP profile with the LinkedIn profile and return the match score and the match reason.
        ICP profile: ${JSON.stringify(icp)}
        LinkedIn profile: ${JSON.stringify(linkedinProfile)}
        
        The comparison should return a json with a score of matchScore from 1 to 100 comparing the two profiles and also a matchReason
        that then is added to the item and the frontend shows it.
        The score of 1 to 100 should be pretty specific, not just 30, 70, 80 or 100. Incude the entire range as a possibiliy. Make it look natural.
        The reason should start directly with the reason it matches and be to-the-point, no filler words, highlight the reason it matches in a max of 100 words. 
        `,
    });

    return object.results;
  }
}
