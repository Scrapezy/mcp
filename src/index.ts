#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SCRAPEZY_API = "https://scrapezy.com/api/";

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: Record<string, string> = {};

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      if (key && value) {
        options[key] = value;
      }
    }
  }

  return options;
}

// Get the API key from command line args or environment variables
function getScrapezyApiKey(): string {
  const args = parseArgs();
  const apiKey = args['api-key'] || process.env.SCRAPEZY_API_KEY;

  if (!apiKey) {
    console.error("Error: SCRAPEZY_API_KEY is required. Either set it as an environment variable or pass it using --api-key=YOUR_KEY");
    process.exit(1);
  }

  return apiKey;
}

const server = new McpServer(
  {
    name: "scrapezy-mcp-server",
    version: "0.1.0",
  }
);

async function callScrapezyApi(url: string, prompt: string) {
  const apiKey = getScrapezyApiKey();

  // Step 1: Submit the extraction job
  const submitResponse = await fetch(`${SCRAPEZY_API}/extract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ url, prompt }),
  });

  const jobData = await submitResponse.json();

  if (!jobData.jobId) {
    return { error: "Failed to submit extraction job" };
  }

  // Step 2: Poll for results
  const maxAttempts = 30; // Maximum number of polling attempts
  const pollingInterval = 2000; // 2 seconds between polling attempts
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    // Wait for the polling interval
    await new Promise(resolve => setTimeout(resolve, pollingInterval));

    // Poll for job status
    const pollResponse = await fetch(`${SCRAPEZY_API}/extract/${jobData.jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    const pollData = await pollResponse.json();

    // If the job is completed or failed, return the results
    if (pollData.status !== "pending") {
      return pollData.result || { error: pollData.error || "Unknown error" };
    }

    // If we've reached the maximum attempts, return a timeout error
    if (attempts >= maxAttempts) {
      return { error: "Extraction job timed out" };
    }
  }

  return { error: "Extraction job timed out" };
}

server.tool(
  "extract-structured-data",
  "Extract structured data from a website.",
  {
    url: z.string().url().describe("URL of the website to extract data from"),
    prompt: z.string().describe("Prompt to extract data from the website"),
  },
  async ({ url, prompt }) => {
    const result = await callScrapezyApi(url, prompt);

    if ("error" in result) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to extract data from ${url}: ${result.error}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
