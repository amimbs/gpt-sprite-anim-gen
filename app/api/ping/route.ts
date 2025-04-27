import { NextRequest, NextResponse } from "next/server";
import { PingResponse, PostResponse } from "../../types";

export async function GET(): Promise<NextResponse<PingResponse>> {
  return NextResponse.json({ message: "👋 API is working!" });
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<PostResponse>> {
  const body = await request.json();
  return NextResponse.json({
    message: "POST received",
    data: body,
  });
}
