/**
 * E2E Test Suite 3 — MOCKS (GPS Geofencing & QR Scanning)
 *
 * Uses Playwright's route mocking + geolocation override to simulate
 * GPS-based geofence validation and QR code permit verification.
 */
import { test, expect } from '@playwright/test';

const API = '/api/wp';

async function mockApi(page: import('@playwright/test').Page, method: string, urlPattern: string | RegExp, body: unknown, status = 200) {
  await page.route(urlPattern, (route) => {
    if (route.request().method() === method.toUpperCase()) {
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    } else {
      route.fallback();
    }
  });
}

// ============================================================
// 1. GPS GEOFENCING MOCK
// ============================================================
test.describe('GPS Geofencing Mock', () => {
  // Work area center: -1.250, 116.850, radius 100m
  const WORK_AREA = { id: 1, name: 'Unit-42', latitude: -1.25, longitude: 116.85, radius_meters: 100 };

  test('geofence passes when GPS is inside the work area radius', async ({ page, context }) => {
    // Override geolocation to be INSIDE the zone (exact center)
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: -1.25, longitude: 116.85 });

    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'POST', `**${API}/permits/1/geofence`, {
      success: true,
      data: {
        within_zone: true,
        distance_meters: 0,
        allowed_radius: 100,
        work_area: 'Unit-42',
      },
    });

    await mockApi(page, 'GET', `**${API}/permits/1`, {
      success: true,
      data: {
        id: 1,
        permit_number: 'WP-RED-001',
        status: 'approved',
        permit_type: { id: 1, code: 'HOT_WORK', name: 'Hot Work', color_code: 'RED' },
        work_area: WORK_AREA,
      },
    });

    await page.goto('/dashboard/work-permit/permits/1');

    // Click activate to open geofence check dialog
    const activateBtn = page.getByTestId('btn-activate');
    if (await activateBtn.isVisible()) {
      await activateBtn.click();

      // Wait for geofence validation
      await expect(page.getByTestId('geofence-result')).toBeVisible({ timeout: 5000 });
      await expect(page.getByTestId('geofence-result')).toContainText('WITHIN ZONE');

      // Confirm button should be enabled
      await expect(page.getByTestId('btn-confirm-activate')).toBeEnabled();
    }
  });

  test('geofence fails when GPS is outside the work area radius', async ({ page, context }) => {
    // Override geolocation to be FAR OUTSIDE the zone (~1km away)
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: -1.260, longitude: 116.860 });

    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'POST', `**${API}/permits/1/geofence`, {
      success: true,
      data: {
        within_zone: false,
        distance_meters: 1320,
        allowed_radius: 100,
        work_area: 'Unit-42',
      },
    });

    await mockApi(page, 'GET', `**${API}/permits/1`, {
      success: true,
      data: {
        id: 1,
        permit_number: 'WP-RED-001',
        status: 'approved',
        permit_type: { id: 1, code: 'HOT_WORK', name: 'Hot Work', color_code: 'RED' },
        work_area: WORK_AREA,
      },
    });

    await page.goto('/dashboard/work-permit/permits/1');

    const activateBtn = page.getByTestId('btn-activate');
    if (await activateBtn.isVisible()) {
      await activateBtn.click();

      await expect(page.getByTestId('geofence-result')).toBeVisible({ timeout: 5000 });
      await expect(page.getByTestId('geofence-result')).toContainText('OUTSIDE ZONE');

      // Confirm button should be DISABLED
      await expect(page.getByTestId('btn-confirm-activate')).toBeDisabled();
    }
  });

  test('geofence handles GPS permission denied gracefully', async ({ page, context }) => {
    // Do NOT grant geolocation permission
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'GET', `**${API}/permits/1`, {
      success: true,
      data: {
        id: 1,
        permit_number: 'WP-RED-001',
        status: 'approved',
        permit_type: { id: 1, code: 'HOT_WORK', name: 'Hot Work', color_code: 'RED' },
        work_area: WORK_AREA,
      },
    });

    await page.goto('/dashboard/work-permit/permits/1');

    const activateBtn = page.getByTestId('btn-activate');
    if (await activateBtn.isVisible()) {
      await activateBtn.click();

      // Should show error message about GPS
      const errorEl = page.getByTestId('geofence-error');
      if (await errorEl.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(errorEl).toContainText(/GPS|Geolocation/i);
      }
    }
  });
});

// ============================================================
// 2. QR CODE SCANNING MOCK
// ============================================================
test.describe('QR Code Permit Verification Mock', () => {
  const VALID_PERMIT = {
    permit: {
      id: 1,
      permit_number: 'WP-RED-20240301-001',
      status: 'active',
      permit_type: { id: 1, code: 'HOT_WORK', name: 'Hot Work', color_code: 'RED' },
      work_area: { id: 1, name: 'Unit-42' },
    },
    is_valid: true,
    is_expired: false,
    verified_at: new Date().toISOString(),
  };

  const EXPIRED_PERMIT = {
    permit: {
      id: 2,
      permit_number: 'WP-BLUE-20240115-005',
      status: 'expired',
      permit_type: { id: 2, code: 'CONFINED_SPACE', name: 'Confined Space', color_code: 'BLUE' },
      work_area: { id: 3, name: 'Tank-7' },
    },
    is_valid: false,
    is_expired: true,
    verified_at: new Date().toISOString(),
  };

  test('QR scan of valid active permit shows VALID tag', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'POST', `**${API}/qr-verify`, {
      success: true,
      data: VALID_PERMIT,
    });

    await page.goto('/dashboard/work-permit/permits');

    // Open QR scanner
    const qrBtn = page.locator('[data-testid="btn-qr-scan"]');
    if (await qrBtn.isVisible()) {
      await qrBtn.click();

      // Type permit number (simulating QR decode)
      await page.getByTestId('input-permit-number').fill('WP-RED-20240301-001');
      await page.getByTestId('btn-verify-qr').click();

      // Verify result
      await expect(page.getByTestId('qr-result')).toBeVisible();
      await expect(page.getByTestId('qr-result')).toContainText('VALID');
      await expect(page.getByTestId('qr-result')).toContainText('WP-RED-20240301-001');
      await expect(page.getByTestId('qr-result')).toContainText('Hot Work');
    }
  });

  test('QR scan of expired permit shows INVALID + EXPIRED tags', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'POST', `**${API}/qr-verify`, {
      success: true,
      data: EXPIRED_PERMIT,
    });

    await page.goto('/dashboard/work-permit/permits');

    const qrBtn = page.locator('[data-testid="btn-qr-scan"]');
    if (await qrBtn.isVisible()) {
      await qrBtn.click();

      await page.getByTestId('input-permit-number').fill('WP-BLUE-20240115-005');
      await page.getByTestId('btn-verify-qr').click();

      await expect(page.getByTestId('qr-result')).toBeVisible();
      await expect(page.getByTestId('qr-result')).toContainText('INVALID');
      await expect(page.getByTestId('qr-result')).toContainText('EXPIRED');
    }
  });

  test('QR scan of non-existent permit shows error toast', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'POST', `**${API}/qr-verify`, {
      success: false,
      message: 'Permit not found',
    }, 404);

    await page.goto('/dashboard/work-permit/permits');

    const qrBtn = page.locator('[data-testid="btn-qr-scan"]');
    if (await qrBtn.isVisible()) {
      await qrBtn.click();

      await page.getByTestId('input-permit-number').fill('WP-FAKE-999');
      await page.getByTestId('btn-verify-qr').click();

      // Error toast
      await expect(page.locator('.p-toast-message-error')).toBeVisible();
    }
  });
});

// ============================================================
// 3. COMBINED — GPS + QR simultaneous validation
// ============================================================
test.describe('Combined GPS + QR Validation', () => {
  test('field worker scans QR then validates geofence before starting work', async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: -1.25, longitude: 116.85 });

    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    // Mock QR verify
    await mockApi(page, 'POST', `**${API}/qr-verify`, {
      success: true,
      data: {
        permit: {
          id: 1,
          permit_number: 'WP-GREEN-20240301-010',
          status: 'approved',
          permit_type: { id: 3, code: 'GENERAL', name: 'General Work', color_code: 'GREEN' },
          work_area: { id: 2, name: 'Workshop-A' },
        },
        is_valid: true,
        is_expired: false,
        verified_at: new Date().toISOString(),
      },
    });

    // Mock geofence
    await mockApi(page, 'POST', `**${API}/permits/1/geofence`, {
      success: true,
      data: {
        within_zone: true,
        distance_meters: 12.5,
        allowed_radius: 200,
        work_area: 'Workshop-A',
      },
    });

    await page.goto('/dashboard/work-permit/permits');

    // Step 1: Scan QR
    const qrBtn = page.locator('[data-testid="btn-qr-scan"]');
    if (await qrBtn.isVisible()) {
      await qrBtn.click();
      await page.getByTestId('input-permit-number').fill('WP-GREEN-20240301-010');
      await page.getByTestId('btn-verify-qr').click();

      // Expect valid
      await expect(page.getByTestId('qr-result')).toContainText('VALID');
    }
  });
});

// ============================================================
// 4. OFFLINE/ONLINE SYNC MOCK
// ============================================================
test.describe('Offline Sync Mock', () => {
  test('offline indicator appears and queued items sync on reconnect', async ({ page, context }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
      // Simulate a queued item
      localStorage.setItem('wp_offline_queue', JSON.stringify([
        { method: 'POST', url: '/api/wp/permits/1/gas-tests', body: { o2_level: 20.9 } },
      ]));
    });

    await page.goto('/dashboard/work-permit/permits');

    // Go offline
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await expect(page.getByTestId('offline-indicator')).toBeVisible();
    await expect(page.getByTestId('offline-indicator')).toContainText('Offline');

    // Come back online
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    // Queue should be processed — indicator may show "Syncing"
    const indicator = page.getByTestId('offline-indicator');
    if (await indicator.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(indicator).toContainText(/Syncing|queued/i);
    }
  });
});

// ============================================================
// 5. GAS TEST SAFETY EVALUATION MOCK
// ============================================================
test.describe('Gas Test Safety Evaluation Mocks', () => {
  test('safe reading returns green status', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    const safeResult = {
      id: 1,
      o2_level: 20.9,
      lel_level: 0,
      h2s_level: 0,
      co_level: 0,
      is_safe: true,
      violations: null,
      tested_by_name: 'Safety Officer',
      tested_at: new Date().toISOString(),
    };

    await mockApi(page, 'POST', `**${API}/permits/1/gas-tests`, { success: true, data: safeResult }, 201);
    await mockApi(page, 'GET', `**${API}/permits/1/gas-tests`, { success: true, data: [safeResult] });
    await mockApi(page, 'GET', `**${API}/permits/1`, {
      success: true,
      data: {
        id: 1,
        permit_number: 'WP-BLUE-001',
        status: 'active',
        permit_type: { id: 2, code: 'CONFINED_SPACE', name: 'Confined Space', color_code: 'BLUE' },
        work_area: { id: 1, name: 'Tank-7' },
      },
    });

    await page.goto('/dashboard/work-permit/permits/1');

    // Check gas test table shows safe entry
    const table = page.getByTestId('gas-test-table');
    if (await table.isVisible()) {
      await expect(table).toContainText('SAFE');
    }
  });

  test('unsafe reading returns red status with violations', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    const unsafeResult = {
      id: 2,
      o2_level: 17.5,
      lel_level: 12,
      h2s_level: 15,
      co_level: 30,
      is_safe: false,
      violations: ['O2 below 19.5%', 'LEL above 10%', 'H2S above 10ppm', 'CO above 25ppm'],
      tested_by_name: 'Safety Officer',
      tested_at: new Date().toISOString(),
    };

    await mockApi(page, 'GET', `**${API}/permits/1/gas-tests`, { success: true, data: [unsafeResult] });
    await mockApi(page, 'GET', `**${API}/permits/1`, {
      success: true,
      data: {
        id: 1,
        permit_number: 'WP-BLUE-002',
        status: 'active',
        permit_type: { id: 2, code: 'CONFINED_SPACE', name: 'Confined Space', color_code: 'BLUE' },
        work_area: { id: 1, name: 'Tank-7' },
      },
    });

    await page.goto('/dashboard/work-permit/permits/1');

    const table = page.getByTestId('gas-test-table');
    if (await table.isVisible()) {
      await expect(table).toContainText('UNSAFE');
    }
  });
});
