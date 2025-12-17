import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './mocks/node';

// JSDOM Pointer Events polyfill (PersonMarker 등에서 사용)
declare global {
  interface HTMLElement {
    setPointerCapture(pointerId: number): void;
    releasePointerCapture(pointerId: number): void;
  }
}

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const {
      src,
      fill: _fill,
      unoptimized: _unoptimized,
      priority: _priority,
      ...rest
    } = props as Record<string, unknown> & { fill?: unknown; unoptimized?: unknown };
    const resolvedSrc =
      typeof src === 'string'
        ? src
        : typeof (src as { src?: unknown } | undefined)?.src === 'string'
          ? (src as { src: string }).src
          : '';

    return React.createElement('img', {
      ...rest,
      src: resolvedSrc
    });
  }
}));

if (!('setPointerCapture' in HTMLElement.prototype)) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (HTMLElement.prototype as HTMLElement).setPointerCapture = () => {};
}
if (!('releasePointerCapture' in HTMLElement.prototype)) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (HTMLElement.prototype as HTMLElement).releasePointerCapture = () => {};
}

// MSW Server Setup
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  // Cleanup after each test
  cleanup();
  // Reset MSW handlers
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
