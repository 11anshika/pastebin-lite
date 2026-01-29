import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis client using environment variables
const redis = Redis.fromEnv();

export const POST = async () => {
  try {
    // Fetch data from Redis for the key "item"
    const result = await redis.get("item");
    
    // Return the result as a standard JSON response
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from Redis" }, { status: 500 });
  }
};