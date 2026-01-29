import { NextResponse } from 'next/server';
import kv from '@/lib/kv';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== 'string' || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const id = nanoid(10);
    const expires_at = ttl_seconds ? Date.now() + (ttl_seconds * 1000) : null;

    const pasteData = {
      content,
      max_views: max_views || null,
      current_views: 0,
      expires_at,
    };

    await kv.hset(`paste:${id}`, pasteData);

    // Set a physical expiry on the key slightly longer than TTL for cleanup
    if (ttl_seconds) {
      await kv.expire(`paste:${id}`, ttl_seconds + 3600); 
    }

    return NextResponse.json({
      id,
      url: `${new URL(req.url).origin}/p/${id}`
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}