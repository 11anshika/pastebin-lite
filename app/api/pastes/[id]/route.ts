import { NextRequest, NextResponse } from 'next/server';
import kv from '@/lib/kv';
import { getNow } from '@/lib/time';

// 1. Notice the 'context' type has changed to a Promise
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } 
) {
  // 2. You MUST await params before using id
  const { id } = await params;
  const key = `paste:${id}`;

  const current_views = await kv.hincrby(key, "current_views", 1);
  const paste: any = await kv.hgetall(key);

  if (!paste) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = getNow(req.headers);
  const expired = paste.expires_at && now > paste.expires_at;
  const limitReached = paste.max_views && current_views > paste.max_views;

  if (expired || limitReached) {
    return NextResponse.json({ error: "Unavailable" }, { status: 404 });
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.max_views ? Math.max(0, paste.max_views - current_views) : null,
    expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null,
  });
}