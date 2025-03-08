import { NextResponse } from "next/server";
import { StagehandResponseSchema } from "@/lib/schemas";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function POST(request: Request) {
  try {
    const { url, prompt } = await request.json();

    // Validate inputs
    if (!url || !prompt) {
      return NextResponse.json(
        { error: "URL and prompt are required" },
        { status: 400 }
      );
    }

    // Make request to the backend
    const response = await fetch(`${BACKEND_URL}/backend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, prompt }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();

    // Validate the response against our schema
    try {
      const validatedData = StagehandResponseSchema.parse(data);
      return NextResponse.json(validatedData);
    } catch (validationError) {
      console.error("Backend response validation error:", validationError);
      return NextResponse.json(
        { error: "Invalid response from backend" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Error creating API endpoint:", error);
    return NextResponse.json(
      { error: "Failed to create API endpoint" },
      { status: 500 }
    );
  }
}
