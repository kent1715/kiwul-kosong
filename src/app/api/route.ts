import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "Simple Storyboard Studio",
    version: "1.0.0",
    columns: ["vo", "image", "video"],
    video_engine: "WAN 2.2 i2v (proxy port 9200)",
    image_mode: "upload",
  });
}
