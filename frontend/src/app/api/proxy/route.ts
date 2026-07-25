import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, headers } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const startTime = performance.now();
    
    // Server-side fetch avoids all browser CORS restrictions & forwards custom auth headers
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'PagePulseBot/1.0',
        ...headers,
      },
    });

    const endTime = performance.now();
    const responseText = await res.text();

    // Extract Page Title
    const titleMatch = responseText.match(/<title[^>]*>([^<]+)<\/title>/i);
    const extractedTitle = titleMatch ? titleMatch[1].trim() : null;

    // Extract OpenGraph OG Meta Tags (og:title, og:description, og:image, og:url, og:site_name, og:type)
    const ogData: Record<string, string> = {};
    const ogRegex = /<meta\s+property=["']og:([a-zA-Z0-9_:-]+)["']\s+content=["']([^"']+)["']/gi;
    let match;
    while ((match = ogRegex.exec(responseText)) !== null) {
      ogData[match[1]] = match[2];
    }
    // Also check reverse attribute order: content="..." property="og:..."
    const ogRegexAlt = /<meta\s+content=["']([^"']+)["']\s+property=["']og:([a-zA-Z0-9_:-]+)["']/gi;
    while ((match = ogRegexAlt.exec(responseText)) !== null) {
      ogData[match[2]] = match[1];
    }

    // Extract detected image URLs (JPG, PNG, WEBP, GIF, SVG)
    const imgRegex = /https?:\/\/[^"\s\\]+\.(?:jpg|jpeg|png|webp|gif|svg)/gi;
    const detectedImages = Array.from(new Set(responseText.match(imgRegex) || [])).slice(0, 12);

    // Extract detected Audio/Video media files (MP3, WAV, OGG, MP4, WEBM)
    const mediaRegex = /https?:\/\/[^"\s\\]+\.(?:mp3|wav|ogg|mp4|webm|m4a|aac)/gi;
    const detectedMedia = Array.from(new Set(responseText.match(mediaRegex) || [])).slice(0, 10);

    return NextResponse.json({
      status_code: res.status,
      load_time_ms: Math.round(endTime - startTime),
      body: responseText,
      extracted_title: extractedTitle,
      og_data: ogData,
      detected_images: detectedImages,
      detected_media: detectedMedia,
      headers: Object.fromEntries(res.headers.entries()),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch target URL' },
      { status: 500 }
    );
  }
}
