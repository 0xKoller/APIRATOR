import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileUrl } = body;

    if (!profileUrl) {
      return NextResponse.json(
        { success: false, message: "LinkedIn profile URL is required" },
        { status: 400 }
      );
    }

    // Call our backend API to get the LinkedIn profile ID
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/linkedin/get-profile-id`,
      { profileUrl }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch LinkedIn profile",
        id: null,
      },
      { status: 500 }
    );
  }
}
