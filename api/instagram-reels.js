const GRAPH_VERSION = process.env.IG_GRAPH_VERSION || 'v21.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 24;

function json(res, statusCode, body, extraHeaders = {}) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const allowOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  Object.entries(extraHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.end(JSON.stringify(body));
}

function parseHandles(rawHandles) {
  if (!rawHandles) return [];
  return rawHandles
    .split(',')
    .map((item) => item.trim().replace(/^@/, '').toLowerCase())
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index);
}

function parseLimit(rawLimit) {
  const parsed = Number.parseInt(rawLimit, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(MAX_LIMIT, parsed));
}

function mediaToReel(media, fallbackHandle) {
  const mediaType = media.media_type;
  const productType = media.media_product_type;
  const isReel = productType === 'REELS';
  const isVideo = mediaType === 'VIDEO';
  if (!isVideo && !isReel) return null;
  if (!media.media_url) return null;

  return {
    id: media.id,
    handle: fallbackHandle,
    caption: media.caption || '',
    duration: media.video_duration || 0,
    thumbnail_url: media.thumbnail_url || '',
    video_url: media.media_url,
    permalink: media.permalink || '',
    timestamp: media.timestamp || '',
  };
}

async function fetchHandleReels({ accessToken, igBusinessUserId, handle, perHandleLimit }) {
  const fields = [
    `business_discovery.username(${handle}){`,
    'username,',
    `media.limit(${perHandleLimit}){`,
    'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,video_duration',
    '}',
    '}',
  ].join('');

  const url = new URL(`${GRAPH_BASE_URL}/${igBusinessUserId}`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('access_token', accessToken);

  const response = await fetch(url.toString(), { method: 'GET' });
  const payload = await response.json();
  if (!response.ok) {
    const errorMessage = payload?.error?.message || 'Instagram request failed';
    throw new Error(errorMessage);
  }

  const mediaList = payload?.business_discovery?.media?.data || [];
  return mediaList.map((media) => mediaToReel(media, handle)).filter(Boolean);
}

function mergedSortedReels(lists, limit) {
  return lists
    .flat()
    .sort((a, b) => {
      const aTime = Date.parse(a.timestamp || '') || 0;
      const bTime = Date.parse(b.timestamp || '') || 0;
      return bTime - aTime;
    })
    .slice(0, limit);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return json(res, 200, { ok: true });
  }

  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed. Use GET.' });
  }

  const accessToken = process.env.IG_ACCESS_TOKEN;
  const igBusinessUserId = process.env.IG_BUSINESS_USER_ID;
  if (!accessToken || !igBusinessUserId) {
    return json(res, 500, {
      error: 'Missing server configuration.',
      details: 'Set IG_ACCESS_TOKEN and IG_BUSINESS_USER_ID in Vercel env vars.',
    });
  }

  const handles = parseHandles(req.query.handles || '');
  const limit = parseLimit(req.query.limit);
  const perHandleLimit = Math.max(3, Math.min(12, limit));

  if (!handles.length) {
    return json(res, 200, {
      reels: [],
      meta: {
        handles: [],
        limit,
        warnings: ['No handles provided.'],
      },
    });
  }

  const successes = [];
  const warnings = [];

  await Promise.all(
    handles.map(async (handle) => {
      try {
        const reels = await fetchHandleReels({
          accessToken,
          igBusinessUserId,
          handle,
          perHandleLimit,
        });
        if (!reels.length) {
          warnings.push(`No public reels found for @${handle}.`);
        } else {
          successes.push(reels);
        }
      } catch (error) {
        warnings.push(`Skipping @${handle}: ${error.message}`);
      }
    })
  );

  const reels = mergedSortedReels(successes, limit);

  return json(res, 200, {
    reels,
    meta: {
      handles,
      limit,
      fetched_handles: successes.length,
      warnings,
    },
  });
}
