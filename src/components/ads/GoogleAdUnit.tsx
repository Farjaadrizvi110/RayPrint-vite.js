/**
 * GoogleAdUnit
 * ------------
 * Renders a responsive Google AdSense unit.
 * Only used inside HomePage — AdSense shows ads ONLY here.
 *
 * ⚠️  Replace YOUR_AD_SLOT_ID below with your real slot from:
 *     AdSense Dashboard → Ads → By ad unit → Create → Copy "data-ad-slot"
 *
 * The publisher ID (ca-pub-9475460975059195) is already loaded in index.html.
 */
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdUnitProps {
  /** Get this from AdSense Dashboard → Ads → By ad unit */
  slot: string;
  className?: string;
}

export function GoogleAdUnit({ slot, className = '' }: GoogleAdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not ready yet — will activate when script loads
    }
  }, []);

  return (
    <div className={`flex justify-center items-center overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9475460975059195"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

