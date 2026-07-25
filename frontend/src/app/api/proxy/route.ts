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

    // Extract Meta Description
    const descMatch = responseText.match(/<meta\s+[^>]*name=["']description["']\s+[^>]*content=["']([^"']+)["']/i) ||
                      responseText.match(/<meta\s+[^>]*content=["']([^"']+)["']\s+[^>]*name=["']description["']/i);
    const extractedDescription = descMatch ? descMatch[1] : null;

    // Extract Viewport Meta Tag
    const hasViewportMeta = /<meta\s+[^>]*name=["']viewport["']/i.test(responseText);

    // Extract Canonical Link Tag
    const canonicalMatch = responseText.match(/<link\s+[^>]*rel=["']canonical["']\s+[^>]*href=["']([^"']+)["']/i) ||
                           responseText.match(/<link\s+[^>]*href=["']([^"']+)["']\s+[^>]*rel=["']canonical["']/i);
    const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;

    // Headings Analysis
    const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    const h1s: string[] = [];
    let h1Match;
    while ((h1Match = h1Regex.exec(responseText)) !== null) {
      const text = h1Match[1].replace(/<[^>]*>/g, '').trim();
      if (text) h1s.push(text);
    }

    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    let h2Count = 0;
    while (h2Regex.exec(responseText) !== null) {
      h2Count++;
    }

    // Images alt analysis
    const imgTagRegex = /<img\s+[^>]*>/gi;
    const imgTags = responseText.match(imgTagRegex) || [];
    const totalImages = imgTags.length;
    let missingAlt = 0;
    imgTags.forEach(tag => {
      if (!/alt=/i.test(tag) || /alt=["']\s*["']/i.test(tag)) {
        missingAlt++;
      }
    });

    // Scripts and Stylesheets count
    const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
    const scripts: string[] = [];
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(responseText)) !== null) {
      scripts.push(scriptMatch[1]);
    }

    const stylesheetRegex = /<link\s+[^>]*rel=["']stylesheet["']/gi;
    const stylesheets: string[] = [];
    let stylesheetMatch;
    while ((stylesheetMatch = stylesheetRegex.exec(responseText)) !== null) {
      stylesheets.push(stylesheetMatch[0]);
    }

    // Fetch robots.txt and sitemap.xml in parallel with a small timeout
    let hasRobotsTxt = false;
    let hasSitemap = false;
    try {
      const urlObj = new URL(url);
      const origin = urlObj.origin;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const [robotsRes, sitemapRes] = await Promise.allSettled([
        fetch(`${origin}/robots.txt`, { method: 'HEAD', signal: controller.signal }),
        fetch(`${origin}/sitemap.xml`, { method: 'HEAD', signal: controller.signal })
      ]);
      clearTimeout(timeoutId);

      if (robotsRes.status === 'fulfilled' && robotsRes.value.ok) {
        hasRobotsTxt = true;
      }
      if (sitemapRes.status === 'fulfilled' && sitemapRes.value.ok) {
        hasSitemap = true;
      }
    } catch (e) {
      // Ignore errors for optional files
    }

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
      extracted_description: extractedDescription,
      has_viewport_meta: hasViewportMeta,
      has_robots_txt: hasRobotsTxt,
      has_sitemap: hasSitemap,
      canonical_url: canonicalUrl,
      h1s: h1s,
      h2_count: h2Count,
      total_images: totalImages,
      missing_alt: missingAlt,
      scripts: scripts,
      stylesheets: stylesheets,
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
