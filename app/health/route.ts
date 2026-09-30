import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "OK",
      message: "Application is healthy",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}