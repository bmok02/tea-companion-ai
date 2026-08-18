import { NextRequest, NextResponse } from "next/server";

// Server-side proxy to the Anthropic Messages API. This plays the role the
// original app's external Render proxy (PROXY_URL) played — it keeps the
// Anthropic API key off the client entirely. Configure it via
// ANTHROPIC_API_KEY in your environment (see .env.local.example).

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  system?: string;
  messages?: ChatMessage[];
}

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: { message: "Server is missing ANTHROPIC_API_KEY." } },
      { status: 500 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body." } },
      { status: 400 }
    );
  }

  const { system, messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: { message: "`messages` must be a non-empty array." } },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system,
        messages,
      }),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : "Upstream request failed." } },
      { status: 502 }
    );
  }
}
