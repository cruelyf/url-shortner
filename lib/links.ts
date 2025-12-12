import client from "./redis";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

export interface LinkData {
  url: string;
  slug: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  password?: string;
}

export async function createLink({
  url,
  slug,
  expiresAt,
  password,
}: {
  url: string;
  slug?: string;
  expiresAt?: string;
  password?: string;
}): Promise<LinkData> {
  const finalSlug = slug || nanoid(6);
  const key = `link:${finalSlug}`;

  // Check slug isn't already taken
  const exists = await client.exists(key);
  if (exists) throw new Error("Slug already taken");

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const link: LinkData = {
    url,
    slug: finalSlug,
    clicks: 0,
    createdAt: new Date().toISOString(),
    ...(expiresAt && { expiresAt }),
    ...(hashedPassword && { password: hashedPassword }),
  };

  await client.hSet(key, {
    ...link,
    clicks: "0",
  });

  // Set TTL if expiration provided
  if (expiresAt) {
    const ttlSeconds = Math.floor(
      (new Date(expiresAt).getTime() - Date.now()) / 1000,
    );
    if (ttlSeconds > 0) await client.expire(key, ttlSeconds);
  }

  return link;
}

export async function getLink(slug: string): Promise<LinkData | null> {
  const data = await client.hGetAll(`link:${slug}`);
  if (!data || Object.keys(data).length === 0) return null;

  return {
    ...data,
    clicks: parseInt(data.clicks || "0"),
  } as LinkData;
}

export async function incrementClicks(slug: string) {
  await client.hIncrBy(`link:${slug}`, "clicks", 1);
}

export async function verifyPassword(
  slug: string,
  password: string,
): Promise<boolean> {
  const link = await getLink(slug);
  if (!link?.password) return true;
  return bcrypt.compare(password, link.password);
}
