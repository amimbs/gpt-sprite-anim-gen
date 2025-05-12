import { NextRequest, NextResponse } from "next/server";
import { PingResponse, PostResponse } from "../../types";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(): Promise<NextResponse<PingResponse>> {
  return NextResponse.json({ message: "👋 API is working!" });
}

export async function POST(request: Request) {
  try {
    const { prompt, resolution } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Create system prompt + user input
    const systemPrompt = `
    You are creating a pixel art walking animaiton for a character sprite using a ${resolution} resolution.
    The walking animation will be rendered in four frames. All frames must fit within the resulting image.
    Your output must match the layout of the reference image, but with the user requested style and design.
    
    User input: 
    '''
    ${prompt}
    '''
    `;

    console.log('System prompt being sent to OpenAI:', systemPrompt);

    // Add the base image to the request
    const imagePath = path.join(
      process.cwd(),
      "app/api/generate/assets/base-walk.png"
    );
    const buf = await fs.promises.readFile(imagePath);
    const uint8Array = new Uint8Array(buf);
    const file = new File([uint8Array], "base-walk.png", { type: "image/png" });

    // Use OpenAI edit api to generate the sequence
    const result = await openai.images.edit({
      image: file,
      prompt: systemPrompt,
      model: "gpt-image-1",
      size: "1024x1024",
      quality: "medium",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

//// todo:
// prompt engineer a way to segreate the 4 images and allow user to click an image tio regenerate using the other images as reference