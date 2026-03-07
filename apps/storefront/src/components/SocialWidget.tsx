'use client';

import { useEffect, useState } from 'react';
import { fetchSocialFeeds, type SocialFeedConfigRecord } from '@/lib/api';

export function SocialWidget() {
  const [feeds, setFeeds] = useState<SocialFeedConfigRecord[]>([]);

  useEffect(() => {
    fetchSocialFeeds().then(setFeeds);
  }, []);

  if (feeds.length === 0) return null;

  return (
    <div className="flex gap-4 items-center justify-center py-6 border-t">
      <span className="text-sm text-gray-500">Follow us</span>
      {feeds.map((f) => {
        const url = (f.config?.url as string) ?? (f.config?.username ? `https://${f.platform}.com/${f.config.username}` : null);
        const label = (f.config?.label as string) ?? f.platform;
        return url ? (
          <a key={f.id} href={url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 capitalize">
            {label}
          </a>
        ) : (
          <span key={f.id} className="text-gray-400 capitalize">{label}</span>
        );
      })}
    </div>
  );
}
