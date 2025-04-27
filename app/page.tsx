"use client";

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.data && data.data[0]?.b64_json) {
        const base64Image = `data:image/png;base64,${data.data[0].b64_json}`;
        setImageUrl(base64Image);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">GPT Sprite Animation Generator</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white mb-4"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Generated Image:</h2>
          <div className="border border-gray-300 rounded-lg p-4 dark:border-gray-600">
            <img 
              src={imageUrl} 
              alt="Generated sprite" 
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}
    </main>
  );
}
