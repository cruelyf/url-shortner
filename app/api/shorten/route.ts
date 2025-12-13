import { NextRequest, NextResponse } from "next/server";
import { createLink } from "@/lib/links";

export async function POST(req: NextRequest) {
  try {
    const { url, slug, expiresAt, password } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const link = await createLink({ url, slug, expiresAt, password });

    return NextResponse.json({
      success: true,
      link: {
        ...link,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/r/${link.slug}`,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Slug already taken") {
      return NextResponse.json(
        { error: "Slug already taken" },
        { status: 409 },
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
