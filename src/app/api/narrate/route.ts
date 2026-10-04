import { NextRequest, NextResponse } from "next/server";

// Server-side proxy to the ElevenLabs text-to-speech API — keeps the API key
// off the client entirely, same role src/app/api/chat/route.ts plays for the
// Anthropic key. Configure via ELEVENLABS_API_KEY (see .env.local.example).

export const runtime = "nodejs";

// Default: "Gabriel — Calm and Peaceful Narrator", a Singaporean library voice.
// The API only lets paid plans (Creator+) use library voices; on the free tier
// set ELEVENLABS_VOICE_ID to a premade voice such as "Lily"
// (pFZP5JQG7iQjIQuC4Bku) instead.
const DEFAULT_VOICE_ID = "sla02gCKN0hNfNn9ORJN";

interface NarrateRequestBody {
  text?: string;
  lang?: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: { message: "Server is missing ELEVENLABS_API_KEY." } },
      { status: 500 }
    );
  }

  let body: NarrateRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid JSON body." } }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json(
      { error: { message: "`text` must be a non-empty string." } },
      { status: 400 }
    );
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

  let upstream: Response;
  try {
    upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        // Pin the language so Mandarin isn't guessed from the text.
        ...(body.lang === "zh" ? { language_code: "zh" } : {}),
      }),
    });
  } catch (err) {
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : "Upstream request failed." } },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status || 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
