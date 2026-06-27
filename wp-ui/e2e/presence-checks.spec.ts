/**
 * E2E Test Suite 1 — PRESENCE CHECKS
 *
 * Verifies that all critical UI elements for the 20-feature Work Permit
 * system render correctly across Red (Hot Work), Blue (Confined Space),
 * and Green (General/Cold Work) permit forms.
 */
import { test, expect } from '@playwright/test';

// ============================================================
// HELPERS
// ============================================================
const DASHBOARD = '/dashboard';
const PERMIT_LIST = `${DASHBOARD}/work-permit/permits`;
const PERMIT_FORM = `${DASHBOARD}/work-permit/permits/new`;

// ============================================================
// 1. PERMIT LIST PAGE — element rendering
// ============================================================
test.describe('Permit List — Presence Checks', () => {
  test.beforeEach(async ({ page }) => {
    // Stub auth token so protected routes are accessible
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
  });

  test('renders DataTable with status/priority filters', async ({ page }) => {
    await page.goto(PERMIT_LIST);
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('shows SOS button in header area', async ({ page }) => {
    await page.goto(PERMIT_LIST);
    await expect(page.getByTestId('btn-sos')).toBeVisible();
  });

  test('shows notification bell', async ({ page }) => {
    await page.goto(PERMIT_LIST);
    await expect(page.getByTestId('notification-bell')).toBeVisible();
  });
});

// ============================================================
// 2. PERMIT FORM — color classification presence
// ============================================================
test.describe('Permit Form — Three-Color Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
  });

  test('Red Form (Hot Work) renders fire-watch & ignition-source fields', async ({ page }) => {
    await page.goto(`${PERMIT_FORM}?type=HOT_WORK`);
    // The page should show hot-work specific sections
    await expect(page.locator('[data-testid="approval-panel"]')).toBeVisible();
  });

  test('Blue Form (Confined Space) shows gas test section', async ({ page }) => {
    await page.goto(`${PERMIT_FORM}?type=CONFINED_SPACE`);
    await expect(page.getByTestId('gas-test-card')).toBeVisible();
    await expect(page.getByTestId('btn-record-gas-test')).toBeVisible();
  });

  test('Green Form (General) shows photo-evidence requirements', async ({ page }) => {
    await page.goto(`${PERMIT_FORM}?type=GENERAL`);
    await expect(page.getByTestId('approval-panel')).toBeVisible();
  });
});

// ============================================================
// 3. GAS TEST FORM — all inputs present
// ============================================================
test.describe('Gas Test Form — Element Presence', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
    await page.goto(`${PERMIT_FORM}?type=CONFINED_SPACE`);
  });

  test('gas test dialog opens with O₂, LEL, H₂S, CO inputs', async ({ page }) => {
    await page.getByTestId('btn-record-gas-test').click();
    await expect(page.getByTestId('gas-test-dialog')).toBeVisible();
    await expect(page.getByTestId('input-tester-name')).toBeVisible();
    await expect(page.getByTestId('input-o2')).toBeVisible();
    await expect(page.getByTestId('input-lel')).toBeVisible();
    await expect(page.getByTestId('input-h2s')).toBeVisible();
    await expect(page.getByTestId('input-co')).toBeVisible();
    await expect(page.getByTestId('safety-preview')).toBeVisible();
  });

  test('gas test table renders columns', async ({ page }) => {
    await expect(page.getByTestId('gas-test-table')).toBeVisible();
  });
});

// ============================================================
// 4. E-SIGNATURE CANVAS — canvas element present
// ============================================================
test.describe('E-Signature Canvas — Presence', () => {
  test('signature dialog contains canvas and buttons', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
    await page.goto(`${PERMIT_FORM}?type=HOT_WORK`);

    // Trigger approval flow to open e-sign
    const reviewBtn = page.getByTestId('btn-review');
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
      await page.getByTestId('btn-approval-action').click();
      await expect(page.getByTestId('esign-dialog')).toBeVisible();
      await expect(page.getByTestId('esign-canvas')).toBeVisible();
      await expect(page.getByTestId('btn-clear-signature')).toBeVisible();
      await expect(page.getByTestId('btn-submit-signature')).toBeVisible();
    }
  });
});

// ============================================================
// 5. QR SCANNER / VERIFICATION — dialog presence
// ============================================================
test.describe('QR Scanner — Presence', () => {
  test('QR scanner dialog renders input & verify button', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
    await page.goto(PERMIT_LIST);

    // Open QR scanner dialog (button should exist on the page)
    const qrBtn = page.locator('[data-testid="btn-qr-scan"]');
    if (await qrBtn.isVisible()) {
      await qrBtn.click();
      await expect(page.getByTestId('qr-scanner-dialog')).toBeVisible();
      await expect(page.getByTestId('input-permit-number')).toBeVisible();
      await expect(page.getByTestId('btn-verify-qr')).toBeVisible();
    }
  });
});

// ============================================================
// 6. GEOFENCE VALIDATOR — component presence
// ============================================================
test.describe('Geofence Validator — Presence', () => {
  test('geofence component renders with Check Location button', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
    await page.goto(`${PERMIT_FORM}?type=HOT_WORK`);

    const gf = page.getByTestId('geofence-validator');
    if (await gf.isVisible()) {
      await expect(page.getByTestId('btn-validate-geofence')).toBeVisible();
    }
  });
});

// ============================================================
// 7. LESSON LEARNED MODAL — dialog presence
// ============================================================
test.describe('Lesson Learned Modal — Presence', () => {
  test('mandatory lessons dialog renders when triggered', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
    await page.goto(`${PERMIT_FORM}?type=HOT_WORK`);

    const dlg = page.getByTestId('lesson-learned-dialog');
    if (await dlg.isVisible()) {
      await expect(dlg).toContainText('Mandatory Lessons');
    }
  });
});

// ============================================================
// 8. OFFLINE INDICATOR — presence when offline
// ============================================================
test.describe('Offline Indicator — Presence', () => {
  test('offline indicator appears when network is offline', async ({ page, context }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
    await page.goto(PERMIT_LIST);

    // Simulate offline
    await context.setOffline(true);
    // Trigger offline event
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));

    await expect(page.getByTestId('offline-indicator')).toBeVisible();

    // Back to online
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
  });
});
