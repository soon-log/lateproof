import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW Worker for Browser (개발 환경)
 *
 * @see https://mswjs.io/docs/integrations/browser
 */
export const worker = setupWorker(...handlers);
