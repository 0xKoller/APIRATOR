import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Call the backend API to generate a Unipile authentication URL
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/unipile/auth-url`,
      { userId }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error generating Unipile authentication URL:", error);
    return NextResponse.json(
      { error: "Failed to generate Unipile authentication URL" },
      { status: 500 }
    );
  }
}
