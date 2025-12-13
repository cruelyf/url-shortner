import { NextRequest, NextResponse } from "next/server";
import { getLink, incrementClicks, verifyPassword } from "@/lib/links";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = await params;
  const link = await getLink(slug);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  // Check expiration
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return NextResponse.json({ error: "Link has expired" }, { status: 410 });
  }

  // Check password
  if (link.password) {
    const passwordHeader = req.headers.get("x-link-password");
    if (!passwordHeader) {
      return NextResponse.json(
        { error: "Password required", passwordRequired: true },
        { status: 401 },
      );
    }
    const valid = await verifyPassword(slug, passwordHeader);
    if (!valid) {
      return NextResponse.json({ error: "Wrong password" }, { status: 403 });
    }
  }

  await incrementClicks(slug);

  return NextResponse.redirect(link.url);
}
