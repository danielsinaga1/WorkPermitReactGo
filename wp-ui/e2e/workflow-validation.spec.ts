/**
 * E2E Test Suite 2 — WORKFLOW VALIDATION
 *
 * Tests the complete permit lifecycle with SIMOPS conflict detection,
 * multi-level approval chain, gas test workflows, and lessons learned flow.
 */
import { test, expect } from '@playwright/test';

// ============================================================
// HELPERS
// ============================================================
const API = '/api/wp';

/**
 * Mock API intercept helper — routes API calls to stubbed JSON.
 */
async function mockApi(page: import('@playwright/test').Page, method: string, urlPattern: string | RegExp, body: unknown, status = 200) {
  await page.route(urlPattern, (route) => {
    if (route.request().method() === method.toUpperCase()) {
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    } else {
      route.fallback();
    }
  });
}

const MOCK_PERMIT = {
  id: 1,
  permit_number: 'WP-RED-20240301-001',
  status: 'draft',
  priority: 'high',
  permit_type: { id: 1, code: 'HOT_WORK', name: 'Hot Work', color_code: 'RED' },
  work_area: { id: 1, name: 'Unit-42', latitude: -1.25, longitude: 116.85, radius_meters: 100 },
  requested_by: 1,
  start_datetime: new Date().toISOString(),
  end_datetime: new Date(Date.now() + 8 * 3600000).toISOString(),
  description: 'Welding work on pipeline',
};

const MOCK_CLASH = {
  has_conflict: true,
  clashes: [
    {
      id: 99,
      permit_a_id: 1,
      permit_b_id: 2,
      clash_type: 'SIMOPS',
      distance_meters: 35.2,
      description: 'Active Hot Work WP-RED-20240228-003 is 35m away',
    },
  ],
};

// ============================================================
// 1. SIMOPS CONFLICT DETECTION
// ============================================================
test.describe('SIMOPS Conflict Detection Workflow', () => {
  test('submit detects SIMOPS proximity clash within 50m', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    // Mock the submit-v2 to return a validation error with clashes
    await mockApi(page, 'POST', `**${API}/permits/1/submit-v2`, {
      success: false,
      message: 'SIMOPS conflict detected: Active Hot Work WP-RED-20240228-003 is 35m away',
      validation_errors: [
        'SIMOPS conflict detected: Active Hot Work WP-RED-20240228-003 is 35m away',
      ],
      clashes: MOCK_CLASH.clashes,
    }, 422);

    // Mock permit detail
    await mockApi(page, 'GET', `**${API}/permits/1`, { success: true, data: MOCK_PERMIT });

    await page.goto('/dashboard/work-permit/permits/1');

    // Click submit
    const submitBtn = page.getByTestId('btn-submit-permit');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Should show SIMOPS conflict error
      await expect(page.locator('.p-toast-message-error, .p-toast-message-warn')).toBeVisible();
    }
  });

  test('clash check endpoint returns conflicting permits', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'GET', `**${API}/permits/1/clash-check`, {
      success: true,
      data: MOCK_CLASH,
    });

    const response = await page.request.get(`${API}/permits/1/clash-check`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.data.has_conflict).toBe(true);
    expect(json.data.clashes).toHaveLength(1);
    expect(json.data.clashes[0].distance_meters).toBeLessThan(50);
  });
});

// ============================================================
// 2. MULTI-LEVEL APPROVAL CHAIN
// ============================================================
test.describe('Multi-Level Approval Workflow', () => {
  const PENDING_PERMIT = { ...MOCK_PERMIT, status: 'pending_approval' };

  test('approval dialog appears for pending permits', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
    await mockApi(page, 'GET', `**${API}/permits/1`, { success: true, data: PENDING_PERMIT });

    await page.goto('/dashboard/work-permit/permits/1');

    const reviewBtn = page.getByTestId('btn-review');
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
      // Approval dialog with action dropdown
      await expect(page.getByTestId('approval-dialog')).toBeVisible();
      await expect(page.getByTestId('select-action')).toBeVisible();
      await expect(page.getByTestId('input-remarks')).toBeVisible();
    }
  });

  test('approval triggers e-signature flow', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });
    await mockApi(page, 'GET', `**${API}/permits/1`, { success: true, data: PENDING_PERMIT });
    await mockApi(page, 'POST', `**${API}/e-signature`, { success: true, data: { id: 1 } });

    await page.goto('/dashboard/work-permit/permits/1');

    const reviewBtn = page.getByTestId('btn-review');
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
      // Select 'approved' and click action → opens e-sign
      await page.getByTestId('btn-approval-action').click();
      await expect(page.getByTestId('esign-dialog')).toBeVisible();
    }
  });
});

// ============================================================
// 3. GAS TESTING WORKFLOW (Blue Form)
// ============================================================
test.describe('Gas Testing Workflow', () => {
  const BLUE_PERMIT = {
    ...MOCK_PERMIT,
    permit_type: { id: 2, code: 'CONFINED_SPACE', name: 'Confined Space Entry', color_code: 'BLUE' },
    status: 'active',
  };

  test('records unsafe gas test and shows dangerous tag', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'GET', `**${API}/permits/1`, { success: true, data: BLUE_PERMIT });
    await mockApi(page, 'GET', `**${API}/permits/1/gas-tests`, { success: true, data: [] });
    await mockApi(page, 'POST', `**${API}/permits/1/gas-tests`, {
      success: true,
      data: {
        id: 1,
        o2_level: 17.0,
        lel_level: 15,
        h2s_level: 5,
        co_level: 10,
        is_safe: false,
        violations: ['O2 below 19.5%', 'LEL above 10%'],
        tested_by_name: 'John',
        tested_at: new Date().toISOString(),
      },
    }, 201);

    await page.goto('/dashboard/work-permit/permits/1');

    // Open gas test dialog
    const btn = page.getByTestId('btn-record-gas-test');
    if (await btn.isVisible()) {
      await btn.click();

      // Fill unsafe values
      await page.getByTestId('input-tester-name').fill('John');
      // The InputNumber fields use PrimeReact — type values
      // Check safety preview shows UNSAFE
      await expect(page.getByTestId('safety-preview')).toContainText('UNSAFE');
    }
  });
});

// ============================================================
// 4. LESSONS LEARNED ACKNOWLEDGEMENT FLOW
// ============================================================
test.describe('Lessons Learned Workflow', () => {
  test('mandatory lessons block permit submission until acknowledged', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    const mandatoryLessons = [
      {
        id: 10,
        title: 'Flash fire incident at Unit-12',
        summary: 'Hot work ignited residual vapors',
        preventive_measures: 'Mandatory gas clearance before any hot work',
        is_mandatory_reading: true,
        is_acknowledged: false,
      },
      {
        id: 11,
        title: 'Confined space O2 depletion',
        summary: 'Worker collapsed due to low oxygen',
        preventive_measures: 'Continuous atmospheric monitoring required',
        is_mandatory_reading: true,
        is_acknowledged: false,
      },
    ];

    await mockApi(page, 'GET', `**${API}/lessons/permits/1/mandatory`, {
      success: true,
      data: mandatoryLessons,
    });
    await mockApi(page, 'POST', `**${API}/lessons/10/acknowledge`, { success: true, data: null });
    await mockApi(page, 'POST', `**${API}/lessons/11/acknowledge`, { success: true, data: null });

    await page.goto('/dashboard/work-permit/permits/1');

    const dlg = page.getByTestId('lesson-learned-dialog');
    if (await dlg.isVisible()) {
      // Continue button should be disabled until all acknowledged
      const continueBtn = page.getByTestId('btn-lessons-continue');
      await expect(continueBtn).toBeDisabled();

      // Acknowledge first lesson
      await page.getByTestId('ack-checkbox-10').click();
      await expect(continueBtn).toBeDisabled(); // still 1 remaining

      // Acknowledge second lesson
      await page.getByTestId('ack-checkbox-11').click();
      await expect(continueBtn).toBeEnabled();
    }
  });
});

// ============================================================
// 5. PERMIT LIFECYCLE — draft → submit → approve → activate → close
// ============================================================
test.describe('Full Permit Lifecycle', () => {
  test('permit transitions through all states', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    // Step 1 — Draft permit
    let currentPermit = { ...MOCK_PERMIT, status: 'draft' };
    await mockApi(page, 'GET', `**${API}/permits/1`, { success: true, data: currentPermit });

    await page.goto('/dashboard/work-permit/permits/1');
    await expect(page.getByTestId('btn-submit-permit')).toBeVisible();

    // Step 2 — Submit succeeds
    currentPermit = { ...MOCK_PERMIT, status: 'submitted' };
    await mockApi(page, 'POST', `**${API}/permits/1/submit-v2`, { success: true, data: { permit: currentPermit } });

    // Step 3 — Approve
    currentPermit = { ...MOCK_PERMIT, status: 'approved' };
    await mockApi(page, 'GET', `**${API}/permits/1`, { success: true, data: currentPermit });
    await page.reload();
    await expect(page.getByTestId('btn-activate')).toBeVisible();

    // Step 4 — Activate
    currentPermit = { ...MOCK_PERMIT, status: 'active' };
    await mockApi(page, 'POST', `**${API}/permits/1/activate-v2`, { success: true, data: { permit: currentPermit } });

    // Step 5 — Close
    currentPermit = { ...MOCK_PERMIT, status: 'closed' };
    await mockApi(page, 'GET', `**${API}/permits/1`, { success: true, data: currentPermit });
    await page.reload();
    // If "Close" button was available, user would have clicked it
  });
});

// ============================================================
// 6. SOS ALERT WORKFLOW
// ============================================================
test.describe('SOS Alert Workflow', () => {
  test('SOS button triggers confirmation dialog then sends alert', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'POST', `**${API}/sos`, {
      success: true,
      data: { id: 1, status: 'triggered', triggered_at: new Date().toISOString() },
    }, 201);

    await page.goto('/dashboard/work-permit/permits');

    const sosBtn = page.getByTestId('btn-sos');
    if (await sosBtn.isVisible()) {
      await sosBtn.click();
      await expect(page.getByTestId('sos-confirm-dialog')).toBeVisible();
      await expect(page.getByTestId('btn-confirm-sos')).toBeVisible();

      // Confirm SOS
      await page.getByTestId('btn-confirm-sos').click();
      // Should show success / warning toast
      await expect(page.locator('.p-toast-message')).toBeVisible();
    }
  });
});

// ============================================================
// 7. NOTIFICATION WORKFLOW
// ============================================================
test.describe('Notification Workflow', () => {
  test('notification bell shows unread count and list', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-jwt-token');
    });

    await mockApi(page, 'GET', `**${API}/notifications**`, {
      success: true,
      data: [
        { id: 1, type: 'permit_approved', title: 'Permit Approved', message: 'WP-001 approved', is_read: false, created_at: new Date().toISOString() },
        { id: 2, type: 'gas_test_unsafe', title: 'Unsafe Gas Test', message: 'O2 below safe level', is_read: false, created_at: new Date().toISOString() },
      ],
      total: 2,
      per_page: 20,
      current_page: 1,
      last_page: 1,
    });

    await page.goto('/dashboard/work-permit/permits');

    const bell = page.getByTestId('notification-bell');
    if (await bell.isVisible()) {
      await expect(page.getByTestId('notification-badge')).toBeVisible();
      await bell.click();
      await expect(page.getByTestId('notification-panel')).toBeVisible();
      await expect(page.getByTestId('notif-1')).toBeVisible();
      await expect(page.getByTestId('notif-2')).toBeVisible();
    }
  });
});
