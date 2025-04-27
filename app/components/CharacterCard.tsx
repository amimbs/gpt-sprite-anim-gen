"use client";

import Image from "next/image";
import React from "react";
import { Character } from "../types";

// Define the props type
interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({
  character,
}: CharacterCardProps): React.ReactElement {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-center mb-3">
        {character.name}
      </h2>
      <div className="flex justify-center">
        <Image
          src="/assets/sprite.png"
          alt={`${character.name} sprite`}
          width={100}
          height={100}
          className="rounded"
        />
      </div>
    </div>
  );
}
