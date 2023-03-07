"use client";

import { useState } from "react";

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptInput, setPromptInput] = useState("");

  const generateReply = async (e: any) => {
    e.preventDefault();

    if (!promptInput || promptInput.trim().length === 0) {
      console.error("Must provide a prompt");

      return;
    }

    setIsLoading(true);
    setGeneratedReply("");
    setPrompt("");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptInput,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    setPrompt(promptInput);
    setPromptInput("");
    setIsLoading(false);

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedReply((prev) => prev + chunkValue);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-2">
        <input
          className="rounded border border-gray-400 p-2"
          placeholder="Ask away..."
          type="text"
          name="promptInput"
          onChange={(e) => setPromptInput(e.target.value)}
          value={promptInput}
        />

        <button
          className="rounded bg-red-600 p-3 text-white hover:bg-red-700"
          onClick={(e) => generateReply(e)}
        >
          Ask Jeeves
        </button>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          prompt && (
            <div className="flex w-full flex-col">
              <div className="w-full p-4 text-lg">
                <p>
                  <strong>You:</strong> {prompt}
                </p>
              </div>

              <div className="w-full bg-gray-100 p-4 ">
                <p>
                  <strong>GPT:</strong> {generatedReply}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
