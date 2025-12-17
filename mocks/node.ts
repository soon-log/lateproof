import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW Server for Node.js (Vitest, Playwright)
 *
 * @see https://mswjs.io/docs/integrations/node
 */
export const server = setupServer(...handlers);
