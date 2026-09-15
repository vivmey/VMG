'use client';

import { useEffect, useRef, useState } from 'react';

type Variant = 'full' | 'bouton' | 'vignette';

const VARIANT_SUFFIX: Record<Variant, string> = {
  full: '/widget',
  bouton: '/widget-bouton',
  vignette: '/widget-vignette',
};

const VARIANT_HEIGHT: Record<Variant, number> = {
  full: 750,
  bouton: 70,
  vignette: 513,
};

type Props = {
  baseUrl: string;
  variant: Variant;
  id?: string;
};

export default function HelloAssoWidget({ baseUrl, variant, id }: Props) {
  const [height, setHeight] = useState(VARIANT_HEIGHT[variant]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const src = baseUrl + VARIANT_SUFFIX[variant];

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (
        typeof e.data === 'object' &&
        e.data !== null &&
        typeof e.data.height === 'number' &&
        typeof e.origin === 'string' &&
        e.origin.includes('helloasso.com')
      ) {
        setHeight(e.data.height);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      id={id}
      src={src}
      style={{ width: '100%', height: `${height}px` }}
      frameBorder="0"
      scrolling="auto"
      allowTransparency
      title="HelloAsso widget"
    />
  );
}
