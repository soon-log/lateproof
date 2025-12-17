import React from 'react';

export default function NextImage(props: Record<string, unknown>) {
  const {
    src,
    alt,
    fill: _fill,
    unoptimized: _unoptimized,
    ...rest
  } = props as Record<string, unknown> & {
    src?: unknown;
    alt?: unknown;
    fill?: unknown;
    unoptimized?: unknown;
  };

  const resolvedSrc =
    typeof src === 'string'
      ? src
      : typeof (src as { src?: unknown } | undefined)?.src === 'string'
        ? (src as { src: string }).src
        : '';

  return React.createElement('img', {
    ...rest,
    src: resolvedSrc,
    alt: typeof alt === 'string' ? alt : ''
  });
}
