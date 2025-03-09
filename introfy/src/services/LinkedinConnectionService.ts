import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { LinkedinProfileService } from "./LinkedinProfileService";

export interface LinkedinConnection {
  "First Name": string;
  "Last Name": string;
  URL: string;
  "Email Address": string;
  Company: string;
  Position: string;
  "Connected On": string;
}

export interface LinkedinReactor {
  urn: string;
  fullName: string;
  headline: string;
  profileUrl: string;
  profilePicture: Array<{ url: string }>;
}

export interface LinkedinReactorsData {
  reactions: LinkedinReactor[];
}

export interface UserInteraction {
  user: string;
  interactions: any[];
  interactionCount: number;
}

class LinkedinConnectionService {
  private connectionsFilePath = path.resolve(
    __dirname,
    "../linkedin_connections.csv"
  );
  private reactorsFilePath = path.resolve(
    __dirname,
    "../linkedin_reactors.json"
  );
  private interactionsFilePath = path.resolve(
    __dirname,
    "../linkedin_profile_interactions_given.json"
  );

  /**
   * Get all LinkedIn connections from the CSV file
   */
  public async getAllConnections(): Promise<LinkedinConnection[]> {
    try {
      const csvContent = fs.readFileSync(this.connectionsFilePath, "utf8");

      const connections = parse(csvContent, {
        columns: true,
        delimiter: ";",
        skip_empty_lines: true,
      }) as LinkedinConnection[];

      return connections;
    } catch (error) {
      console.error("Error reading connections file:", error);
      throw error;
    }
  }

  /**
   * Get all LinkedIn reactors from the JSON file
   */
  public async getAllReactors(): Promise<LinkedinReactorsData> {
    try {
      const jsonContent = fs.readFileSync(this.reactorsFilePath, "utf8");
      const reactorsData = JSON.parse(jsonContent) as LinkedinReactorsData;

      return reactorsData;
    } catch (error) {
      console.error("Error reading reactors file:", error);
      throw error;
    }
  }

  /**
   * Filter LinkedIn connections to exclude reactors
   */
  public async getFilteredConnections(): Promise<LinkedinConnection[]> {
    try {
      const connections = await this.getAllConnections();
      const reactorsData = await this.getAllReactors();

      // Extract reactor profile URLs for efficient lookup
      const reactorProfileUrls = new Set(
        reactorsData.reactions.map((reactor) => reactor.profileUrl)
      );

      // Filter connections to exclude reactors
      const filteredConnections = connections.filter((connection) => {
        return !reactorProfileUrls.has(connection.URL);
      });

      return filteredConnections;
    } catch (error) {
      console.error("Error filtering connections:", error);
      throw error;
    }
  }

  /**
   * Get all interactions between Luciano Trujillo and LinkedIn connections
   * @returns Array of users with their interactions and interaction counts
   */
  public async getUserInteractions(
    username: string
  ): Promise<UserInteraction[]> {
    try {
      // Get all connections from CSV
      const connections = await this.getAllConnections();

      // Read interactions file
      const linkedinProfileService = new LinkedinProfileService();
      const interactionsContent = await linkedinProfileService.getProfileLikes(
        username,
        0
      );
      const interactionsData = interactionsContent;

      // Create a map of URL to connections for faster lookup
      const connectionMap = new Map<string, LinkedinConnection>();
      for (const connection of connections) {
        connectionMap.set(connection.URL, connection);
      }

      // Track interactions per user
      const userInteractions = new Map<
        string,
        {
          user: string;
          interactions: any[];
          interactionCount: number;
        }
      >();

      // Process all interaction items
      if (interactionsData.data && interactionsData.data.items) {
        for (const item of interactionsData.data.items) {
          // Check if this is an interaction with Luciano Trujillo
          if (item.action) {
            const authorUrl = item.author?.url;

            if (authorUrl && connectionMap.has(authorUrl)) {
              // This is an interaction with a connection
              if (!userInteractions.has(authorUrl)) {
                userInteractions.set(authorUrl, {
                  user: authorUrl,
                  interactions: [],
                  interactionCount: 0,
                });
              }

              // Add this interaction to the user's interactions
              const userInteraction = userInteractions.get(authorUrl)!;
              userInteraction.interactions.push(item);
              userInteraction.interactionCount++;
            }
          }
        }
      }

      // Convert map to array and sort by interaction count (descending)
      return Array.from(userInteractions.values()).sort(
        (a, b) => b.interactionCount - a.interactionCount
      );
    } catch (error) {
      console.error("Error calculating user interactions:", error);
      throw error;
    }
  }
}

export const linkedinConnectionService = new LinkedinConnectionService();
