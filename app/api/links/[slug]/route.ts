import { NextRequest, NextResponse } from "next/server";
import { getLink } from "@/lib/links";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const link = await getLink(slug);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  // Don't expose the hashed password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...safeLink } = link;

  return NextResponse.json({
    ...safeLink,
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/r/${link.slug}`,
    hasPassword: !!link.password,
    isExpired: link.expiresAt ? new Date(link.expiresAt) < new Date() : false,
  });
}
