import { expect, test } from '@playwright/test';

/**
 * Example E2E Test
 *
 * 실제 테스트는 Phase 2 (M2) 이후 작성됩니다.
 */
test.describe('Example', () => {
  test.skip('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LateProof/);
  });
});
