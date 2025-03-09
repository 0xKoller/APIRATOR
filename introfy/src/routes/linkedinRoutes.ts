import express, { Request, Response } from "express";
import { getLinkedinProfileService } from "../services/LinkedinProfileService";
import { linkedinConnectionService } from "../services/LinkedinConnectionService";

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

    const linkedinProfileService = getLinkedinProfileService();
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

    const linkedinProfileService = getLinkedinProfileService();
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

/**
 * @route GET /api/linkedin/filter-connections
 * @desc Get LinkedIn connections excluding those in the reactors list
 * @access Public
 */
router.get("/filter-connections", async (req: Request, res: Response) => {
  try {
    const filteredConnections =
      await linkedinConnectionService.getFilteredConnections();

    return res.status(200).json({
      success: true,
      data: {
        connections: filteredConnections,
        total: filteredConnections.length,
      },
    });
  } catch (error) {
    console.error("Error filtering LinkedIn connections:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
});

/**
 * @route GET /api/linkedin/profile-likes
 * @desc Get LinkedIn profile likes by username with pagination
 * @access Public
 * @param {string} username - LinkedIn username
 * @param {number} start - Pagination start index
 */
router.get("/profile-likes", async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;
    const start = req.query.start ? parseInt(req.query.start as string) : 0;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const linkedinProfileService = getLinkedinProfileService();
    const profileLikes = await linkedinProfileService.getProfileLikes(
      username,
      start
    );

    return res.status(200).json({
      success: true,
      message: "",
      data: profileLikes.data,
    });
  } catch (error) {
    console.error("Error fetching LinkedIn profile likes:", error);

    // Check if this is a Zod validation error
    if (error instanceof Error && error.message.includes("invalid_type")) {
      return res.status(500).json({
        success: false,
        message: "Data validation error - API response format has changed",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
});

/**
 * @route GET /api/linkedin/user-interactions
 * @desc Get interactions between Luciano Trujillo and LinkedIn connections
 * @access Public
 */
router.get("/user-interactions", async (req: Request, res: Response) => {
  try {
    const userInteractions =
      await linkedinConnectionService.getUserInteractions(
        (req.query.url as string).split("/in/")[1].replace("/", "")
      );

    return res.status(200).json({
      success: true,
      data: {
        interactions: userInteractions,
        total: userInteractions.length,
      },
    });
  } catch (error) {
    console.error("Error fetching user interactions:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
});

export default router;
