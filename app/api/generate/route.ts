import { NextRequest, NextResponse } from "next/server";
import { PingResponse, PostResponse } from "../../types";
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function GET(): Promise<NextResponse<PingResponse>> {
  return NextResponse.json({ message: "👋 API is working!" });
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
      background: "transparent",
      quality: "high"
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
