"use client";

import React from "react";
import TestButton from "./components/TestButton";

export default function Home(): React.ReactElement {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Design</h1>
      <p className="mb-4">Cool vidja game sprites!</p>
      <TestButton />
    </main>
  );
}
