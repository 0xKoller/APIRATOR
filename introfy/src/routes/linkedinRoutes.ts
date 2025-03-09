import express, { Request, Response } from "express";
import { linkedinProfileService } from "../services/LinkedinProfileService";

const router = express.Router();

/**
 * @route GET /api/linkedin/profile
 * @desc Get LinkedIn profile information by URL
 * @access Public
 * @param {string} url - LinkedIn profile URL
 */
router.get("/profile", async (req: Request, res: Response) => {
  try {
    const profileUrl = req.query.url as string;

    if (!profileUrl) {
      return res.status(400).json({
        success: false,
        message: "Profile URL is required",
      });
    }

    const profile = await linkedinProfileService.getProfileByUrl(profileUrl);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
});

/**
 * @route GET /api/linkedin/post/interactors
 * @desc Get interactors (reactions and comments) for a LinkedIn post
 * @access Public
 * @param {string} urn - LinkedIn post URN
 */
router.get("/post/interactors", async (req: Request, res: Response) => {
  try {
    const postUrn = req.query.urn as string;

    if (!postUrn) {
      return res.status(400).json({
        success: false,
        message: "Post URN is required",
      });
    }

    const interactors = await linkedinProfileService.getPostInteractors(
      postUrn
    );

    res.status(200).json({
      success: true,
      data: {
        reactions: interactors.reactions,
        comments: interactors.comments,
        totalReactions: interactors.reactions.length,
        totalComments: interactors.comments.length,
      },
    });
  } catch (error) {
    console.error("Error fetching LinkedIn post interactors:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
});

export default router;
