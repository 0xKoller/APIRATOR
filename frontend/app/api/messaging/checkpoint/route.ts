import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountId, code } = body;

    if (!accountId || !code) {
      return NextResponse.json(
        { error: "Account ID and code are required" },
        { status: 400 }
      );
    }

    // Call the backend API to handle a Unipile checkpoint
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/unipile/checkpoint`,
      { accountId, code }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error handling Unipile checkpoint:", error);
    return NextResponse.json(
      { error: "Failed to handle Unipile checkpoint" },
      { status: 500 }
    );
  }
}
