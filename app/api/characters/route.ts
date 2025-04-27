import { NextResponse } from "next/server";
import { Character, CharactersResponse } from "../../types";

export async function GET(): Promise<NextResponse<CharactersResponse>> {
  // Mock character data with just names
  const characters: Character[] = [
    { id: 1, name: "Greg" },
    { id: 2, name: "Agamennon" },
    { id: 3, name: "Fredrick" },
    { id: 4, name: "Alaz" },
    { id: 5, name: "Crow" },
  ];

  return NextResponse.json({ characters });
}
