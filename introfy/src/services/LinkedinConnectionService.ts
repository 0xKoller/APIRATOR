import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

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

class LinkedinConnectionService {
  private connectionsFilePath = path.resolve(
    __dirname,
    "../linkedin_connections.csv"
  );
  private reactorsFilePath = path.resolve(
    __dirname,
    "../linkedin_reactors.json"
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
}

export const linkedinConnectionService = new LinkedinConnectionService();
