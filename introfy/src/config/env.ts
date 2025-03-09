import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default {
  PORT: process.env.PORT || 3001,
  REAL_TIME_LINKEDIN_SCRAPER_API_KEY:
    process.env.REAL_TIME_LINKEDIN_SCRAPER_API_KEY,
};
