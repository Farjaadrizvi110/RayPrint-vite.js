/**
 * AdsController
 * -------------
 * Route-aware ad manager. Renders Adsterra + Monetag ONLY on non-home pages.
 * Google AdSense is handled separately in <GoogleAdUnit> placed inside HomePage.
 */
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

// ─── Adsterra 468×60 Banner ──────────────────────────────────────────────────
function AdsterraBanner({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set Adsterra options on window BEFORE loading invoke.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as unknown as Record<string, unknown>).atOptions = {
      key: 'f02ffe7c524aaf0fde21d2a89fbcb97d',
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    };

    const script = document.createElement('script');
    script.src =
      'https://www.highperformanceformat.com/f02ffe7c524aaf0fde21d2a89fbcb97d/invoke.js';
    container.appendChild(script);

    return () => {
      // Clean up iframe + script when unmounting
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100000,
        lineHeight: 0,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        title="Close ad"
        style={{
          position: 'absolute',
          top: -22,
          right: 0,
          background: 'rgba(15,23,42,0.75)',
          border: 'none',
          borderRadius: '6px 6px 0 0',
          color: '#fff',
          cursor: 'pointer',
          padding: '2px 7px',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          lineHeight: '16px',
        }}
      >
        <X size={10} /> close ad
      </button>

      <div ref={containerRef} style={{ lineHeight: 0 }} />
    </div>
  );
}

// ─── AdsController ───────────────────────────────────────────────────────────
export function AdsController() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [adsterraDismissed, setAdsterraDismissed] = useState(false);

  // ── Monetag popunder – inject only on non-home pages ──────────────────────
  useEffect(() => {
    const SCRIPT_ID = 'monetag-pageup';

    if (!isHome) {
      if (!document.getElementById(SCRIPT_ID)) {
        const s = document.createElement('script');
        s.id = SCRIPT_ID;
        s.dataset.zone = '10785580';
        s.src = 'https://nap5k.com/tag.min.js';
        document.body.appendChild(s);
      }
    } else {
      // Remove Monetag when returning to home
      document.getElementById(SCRIPT_ID)?.remove();
    }
  }, [isHome]);

  // Reset Adsterra dismissed state when navigating between pages
  useEffect(() => {
    setAdsterraDismissed(false);
  }, [pathname]);

  // Home page → no Adsterra, no Monetag visible
  if (isHome) return null;

  // Other pages → Adsterra banner (dismissible)
  if (adsterraDismissed) return null;

  return <AdsterraBanner onClose={() => setAdsterraDismissed(true)} />;
}

