
"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const lastPage = useRef<string | null>(null);

  const query = searchParams.toString();
  const page = query ? `${pathname}?${query}` : pathname;

  useEffect(() => {
    if (!ready || !window.fbq) return;
    if (lastPage.current === page) return;

    window.fbq("track", "PageView");
    lastPage.current = page;
  }, [page, ready]);

  if (!PIXEL_ID) return null;

  return (
    <Script
      id="understandmylove-meta-pixel"
      strategy="afterInteractive"
      onReady={() => setReady(true)}
    >
      {`
        !function(f,b,e,v,n,t,s){
          if(f.fbq)return;
          n=f.fbq=function(){
            n.callMethod
              ? n.callMethod.apply(n,arguments)
              : n.queue.push(arguments)
          };
          if(!f._fbq)f._fbq=n;
          n.push=n;
          n.loaded=!0;
          n.version='2.0';
          n.queue=[];
          t=b.createElement(e);
          t.async=!0;
          t.src=v;
          s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s);
        }(
          window,
          document,
          'script',
          'https://connect.facebook.net/en_US/fbevents.js'
        );

        fbq('init', '${PIXEL_ID}');
      `}
    </Script>
  );
}
