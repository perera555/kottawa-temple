import "server-only";

export type YtVideo = { id: string; title: string; published: string };

/**
 * Latest uploads from a channel's public RSS feed (no API key needed).
 * Cached for 30 minutes, so new videos appear on the site automatically.
 */
export async function getLatestYoutube(channelId: string, limit = 6): Promise<YtVideo[]> {
  if (!channelId) return [];
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);
    const decode = (s: string) =>
      s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    return entries.slice(0, limit).map((e) => ({
      id: /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(e)?.[1] ?? "",
      title: decode(/<title>([^<]*)<\/title>/.exec(e)?.[1] ?? ""),
      published: /<published>([^<]+)<\/published>/.exec(e)?.[1] ?? "",
    })).filter((v) => v.id);
  } catch (err) {
    console.error("[youtube]", err);
    return [];
  }
}
