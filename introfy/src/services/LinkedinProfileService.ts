import axios from "axios";
import axiosRetry from "axios-retry";
import { z } from "zod";

// LinkedIn Profile Schemas and Types
export const LinkedinProfileResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  headline: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  profilePicture: z.string().nullable().optional(),
  urn: z.string().optional(),
  backgroundImage: z
    .array(
      z.object({
        width: z.number(),
        height: z.number(),
        url: z.string(),
      })
    )
    .nullable()
    .optional(),
  educations: z
    .array(
      z.object({
        start: z
          .object({
            year: z.number(),
            month: z.number(),
            day: z.number(),
          })
          .optional(),
        end: z
          .object({
            year: z.number(),
            month: z.number(),
            day: z.number(),
          })
          .optional(),
        degree: z.string().optional(),
        fieldOfStudy: z.string().optional(),
        schoolName: z.string().optional(),
      })
    )
    .optional(),
  skills: z.array(z.object({ name: z.string() })).optional(),
  geo: z
    .object({
      country: z.string(),
      city: z.string().optional(),
      full: z.string(),
      countryCode: z.string().optional(),
    })
    .optional(),
  position: z
    .array(
      z.object({
        companyName: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        location: z.string().nullable(),
        start: z.object({
          year: z.number(),
          month: z.number(),
          day: z.number(),
        }),
        end: z
          .object({
            year: z.number(),
            month: z.number(),
            day: z.number(),
          })
          .nullable(),
      })
    )
    .optional(),
});

export type LinkedinProfileResponse = z.infer<
  typeof LinkedinProfileResponseSchema
>;

// Post Reaction Types
export const LinkedinReactionSchema = z.object({
  urn: z.string(),
  fullName: z.string(),
  headline: z.string().optional(),
  profileUrl: z.string(),
  profilePicture: z.array(z.object({ url: z.string() })).nullable(),
});

export type LinkedinReaction = z.infer<typeof LinkedinReactionSchema>;

export const LinkedinPostReactionsResponseSchema = z.object({
  data: z.object({
    items: z.array(LinkedinReactionSchema),
    totalPages: z.number(),
  }),
});

export type LinkedinPostReactionsResponse = z.infer<
  typeof LinkedinPostReactionsResponseSchema
>;

// Post Comment Types
export const LinkedinCommentAuthorSchema = z.object({
  name: z.string(),
  urn: z.string(),
  id: z.string(),
  username: z.string(),
  linkedinUrl: z.string(),
  title: z.string(),
});

export const LinkedinCommentSchema = z.object({
  isPinned: z.boolean(),
  isEdited: z.boolean(),
  threadUrn: z.string(),
  createdAt: z.number(),
  createdAtString: z.string(),
  permalink: z.string(),
  text: z.string(),
  author: LinkedinCommentAuthorSchema,
});

export type LinkedinComment = z.infer<typeof LinkedinCommentSchema>;

export const LinkedinPostCommentsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(LinkedinCommentSchema),
  total: z.number(),
  totalPage: z.number(),
  paginationToken: z.string().optional(),
});

export type LinkedinPostCommentsResponse = z.infer<
  typeof LinkedinPostCommentsResponseSchema
>;

// Profile Likes Types
export const LinkedinProfileLikeAuthorSchema = z
  .object({
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    headline: z.string().optional().nullable(),
    username: z.string().optional().nullable(),
    url: z.string().optional().nullable(),
  })
  .optional()
  .nullable()
  .default({});

export const LinkedinProfileLikeImageSchema = z.object({
  url: z.string(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
});

export const LinkedinProfileLikeSchema = z.object({
  action: z.string(),
  entityType: z.string().optional().nullable(),
  text: z.string().optional().nullable(),
  totalReactionCount: z.number().optional().nullable().default(0),
  likeCount: z.number().optional().nullable().default(0),
  appreciationCount: z.number().optional().nullable(),
  empathyCount: z.number().optional().nullable(),
  praiseCount: z.number().optional().nullable(),
  InterestCount: z.number().optional().nullable(),
  funnyCount: z.number().optional().nullable(),
  commentsCount: z.number().optional().nullable().default(0),
  repostsCount: z.number().optional().nullable(),
  postUrl: z.string().optional().nullable(),
  postedAt: z.string().optional().nullable(),
  postedDate: z.string().optional().nullable(),
  shareUrn: z.string().optional().nullable(),
  urn: z.string().optional().nullable(),
  author: LinkedinProfileLikeAuthorSchema,
  image: z.array(LinkedinProfileLikeImageSchema).optional().nullable(),
  video: z.array(LinkedinProfileLikeImageSchema).optional().nullable(),
  company: z.object({}).optional().nullable(),
  comment: z
    .object({
      text: z.string().optional().nullable(),
      author: z.object({}).optional().nullable(),
      company: z.object({}).optional().nullable(),
    })
    .optional()
    .nullable(),
  article: z.object({}).optional().nullable(),
});

export type LinkedinProfileLike = z.infer<typeof LinkedinProfileLikeSchema>;

export const LinkedinProfileLikesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    items: z.array(LinkedinProfileLikeSchema),
    paginationToken: z.string().optional(),
  }),
});

export type LinkedinProfileLikesResponse = z.infer<
  typeof LinkedinProfileLikesResponseSchema
>;

// Configure axios retry logic
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  onRetry: (retryCount: number, error: any) => {
    console.warn(`Retrying request: ${retryCount}`, { error });
  },
});

export class LinkedinProfileService {
  private API_HOST = "linkedin-data-api.p.rapidapi.com";
  private API_KEY: string =
    "ec52a7d13amshbc928b013488027p17ca42jsn59464802b8a2";

  constructor() {
    this.validateApiKey();
  }

  private validateApiKey(): void {
    if (!this.API_KEY) {
      throw new Error(
        "API key not configured. Please set REAL_TIME_LINKEDIN_SCRAPER_API_KEY in .env file"
      );
    }
  }

  /**
   * Fetches a LinkedIn profile by its public URL
   * @param profileUrl The public LinkedIn profile URL
   * @returns LinkedIn profile data
   */
  public async getProfileByUrl(
    profileUrl: string
  ): Promise<LinkedinProfileResponse> {
    console.info(`Fetching LinkedIn profile by URL: ${profileUrl}`);

    const response = await axios.get(
      `https://${this.API_HOST}/get-profile-data-by-url`,
      {
        params: {
          url: profileUrl,
        },
        headers: {
          "x-rapidapi-host": this.API_HOST,
          "x-rapidapi-key": this.API_KEY,
        },
      }
    );

    // Include schema parsing in the retry logic
    return LinkedinProfileResponseSchema.parse(response.data);
  }

  /**
   * Gets all reactions for a LinkedIn post
   * @param postUrn The URN identifier for the LinkedIn post
   * @returns Array of LinkedIn reactions
   */
  public async getPostReactions(
    postUrn: string,
    page = 1
  ): Promise<LinkedinPostReactionsResponse> {
    try {
      const response = await axios.post(
        `https://${this.API_HOST}/get-post-reactions`,
        { urn: postUrn, page },
        {
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": this.API_HOST,
            "x-rapidapi-key": this.API_KEY,
          },
        }
      );

      const validatedResponse = LinkedinPostReactionsResponseSchema.parse(
        response.data
      );
      console.debug(
        `Successfully fetched post reactions for ${postUrn}, page ${page}`
      );

      return validatedResponse;
    } catch (error) {
      console.error(`Error fetching post reactions: ${error}`);
      throw error;
    }
  }

  /**
   * Gets all reactions for a LinkedIn post across all pages
   * @param postUrn The URN identifier for the LinkedIn post
   * @returns Array of all LinkedIn reactions
   */
  public async getAllPostReactions(
    postUrn: string
  ): Promise<LinkedinReaction[]> {
    try {
      const firstPage = await this.getPostReactions(postUrn);

      if (!firstPage?.data?.items?.length) {
        console.info(`No reactions found for post ${postUrn}`);
        return [];
      }

      let allReactions = [...firstPage.data.items];
      const totalPages = firstPage.data.totalPages || 1;

      for (let page = 2; page <= totalPages; page++) {
        const nextPage = await this.getPostReactions(postUrn, page);
        if (nextPage?.data?.items?.length) {
          allReactions = [...allReactions, ...nextPage.data.items];
        }
      }

      console.info(
        `Successfully fetched all post reactions for ${postUrn}: ${allReactions.length} total reactions`
      );
      return allReactions;
    } catch (error) {
      console.error(`Error fetching all post reactions: ${error}`);
      throw error;
    }
  }

  /**
   * Gets comments for a LinkedIn post for a specific page
   * @param postUrn The URN identifier for the LinkedIn post
   * @param page The page number to fetch (default 1)
   * @returns LinkedIn post comments response
   */
  public async getPostComments(
    postUrn: string,
    page = 1
  ): Promise<LinkedinPostCommentsResponse> {
    try {
      const response = await axios.get(
        `https://${this.API_HOST}/get-profile-posts-comments`,
        {
          params: {
            urn: postUrn,
            sort: "mostRelevant",
            page,
          },
          headers: {
            "x-rapidapi-host": this.API_HOST,
            "x-rapidapi-key": this.API_KEY,
          },
        }
      );

      const validatedResponse = LinkedinPostCommentsResponseSchema.parse(
        response.data
      );
      console.debug(
        `Successfully fetched post comments for ${postUrn}, page ${page}`
      );

      return validatedResponse;
    } catch (error) {
      console.error(`Error fetching post comments: ${error}`);
      throw error;
    }
  }

  /**
   * Gets all comments for a LinkedIn post across all pages
   * @param postUrn The URN identifier for the LinkedIn post
   * @returns Array of all LinkedIn comments
   */
  public async getAllPostComments(postUrn: string): Promise<LinkedinComment[]> {
    try {
      const firstPage = await this.getPostComments(postUrn);

      if (!firstPage?.data?.length) {
        console.info(`No comments found for post ${postUrn}`);
        return [];
      }

      let allComments = [...firstPage.data];
      const totalPages = firstPage.totalPage || 1;

      for (let page = 2; page <= totalPages; page++) {
        const nextPage = await this.getPostComments(postUrn, page);
        if (nextPage?.data?.length) {
          allComments = [...allComments, ...nextPage.data];
        }
      }

      console.info(
        `Successfully fetched all post comments for ${postUrn}: ${allComments.length} total comments`
      );
      return allComments;
    } catch (error) {
      console.error(`Error fetching all post comments: ${error}`);
      throw error;
    }
  }

  /**
   * Gets all interactors (both reactions and comments) for a LinkedIn post
   * @param postUrn The URN identifier for the LinkedIn post
   * @returns Object containing reactions and comments arrays
   */
  public async getPostInteractors(postUrn: string): Promise<{
    reactions: LinkedinReaction[];
    comments: LinkedinComment[];
  }> {
    try {
      // Fetch reactions and comments in parallel
      const [reactions, comments] = await Promise.all([
        this.getAllPostReactions(postUrn),
        this.getAllPostComments(postUrn),
      ]);

      console.info(
        `Successfully fetched all post interactors for ${postUrn}: ${reactions.length} reactions, ${comments.length} comments`
      );

      return { reactions, comments };
    } catch (error) {
      console.error(`Error fetching post interactors: ${error}`);
      throw error;
    }
  }

  /**
   * Gets profile likes for a LinkedIn user
   * @param username The LinkedIn username
   * @param start Starting position for pagination
   * @returns LinkedIn profile likes
   */
  public async getProfileLikes(
    username: string,
    start: number = 0
  ): Promise<LinkedinProfileLikesResponse> {
    try {
      console.info(
        `Fetching LinkedIn profile likes for user: ${username}, starting from: ${start}`
      );

      const response = await axios.get(
        `https://${this.API_HOST}/get-profile-likes`,
        {
          params: {
            username,
            start,
          },
          headers: {
            "x-rapidapi-host": this.API_HOST,
            "x-rapidapi-key": this.API_KEY,
          },
        }
      );

      // Pre-process the data to ensure it conforms to the schema
      if (
        response.data?.data?.items &&
        Array.isArray(response.data.data.items)
      ) {
        // Ensure each item has the required fields with defaults
        response.data.data.items = response.data.data.items.map((item: any) => {
          // Ensure the author object exists
          if (!item.author) {
            item.author = {};
          }

          // Ensure commentsCount exists
          if (item.commentsCount === undefined) {
            item.commentsCount = 0;
          }

          return item;
        });
      }

      return LinkedinProfileLikesResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error fetching profile likes: ${error}`);
      throw error;
    }
  }
}

// Export a singleton instance for easy use
export const linkedinProfileService = new LinkedinProfileService();
