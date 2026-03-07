'use client';

import { useEffect, useState } from 'react';

const COOKIE_NAME = 'use-dummy-data';

function getDummyFromClient(): boolean {
  if (typeof document === 'undefined') return false;
  return (
    process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true' ||
    document.cookie.includes(`${COOKIE_NAME}=1`)
  );
}

function setDummyCookie(on: boolean) {
  if (on) {
    document.cookie = `${COOKIE_NAME}=1; path=/; max-age=31536000`;
  } else {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  }
  window.location.reload();
}

export function DummyDataBanner() {
  const [useDummy, setUseDummy] = useState<boolean | null>(null);

  useEffect(() => {
    setUseDummy(getDummyFromClient());
  }, []);

  if (useDummy === null) return null;

  if (useDummy) {
    return (
      <div className="bg-[rgb(var(--color-accent))] text-white text-center py-2 px-4 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span>You&apos;re viewing demo data with placeholder images.</span>
        <button
          type="button"
          onClick={() => setDummyCookie(false)}
          className="underline font-medium hover:no-underline focus:outline-none focus:ring-2 focus:ring-white rounded"
        >
          Use real data
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-center py-1.5 px-4 text-sm">
      <button
        type="button"
        onClick={() => setDummyCookie(true)}
        className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] rounded"
      >
        View demo site
      </button>
    </div>
  );
}
