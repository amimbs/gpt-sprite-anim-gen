"use client";

import React, { useState } from "react";
import { PingResponse } from "../types";

export default function TestButton(): React.ReactElement {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleGenerate(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch("/api/ping");
      const data = (await res.json()) as PingResponse;
      setResponse(data.message || "Ping successful");
    } catch (error) {
      if (error instanceof Error) {
        setResponse("Error: " + error.message);
      } else {
        setResponse("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Loading..." : "Test Ping"}
      </button>
      {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
