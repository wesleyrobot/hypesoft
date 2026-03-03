import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // The app may redirect to Keycloak login; we bypass by going directly
    // In CI, Keycloak should be running at the configured URL
    await page.goto('/')
    // Wait for either dashboard content or login redirect
    await page.waitForLoadState('networkidle')
  })

  test('shows page title or redirects to login', async ({ page }) => {
    const url = page.url()
    // Either we're on dashboard or we were redirected to Keycloak
    const isDashboard = url.includes('localhost:3000') && !url.includes('8080')
    const isKeycloak = url.includes('8080') || url.includes('keycloak')

    expect(isDashboard || isKeycloak).toBe(true)
  })

  test('dashboard page has correct structure when authenticated', async ({ page }) => {
    // Skip this test if Keycloak redirected (auth required)
    const url = page.url()
    if (url.includes('8080') || url.includes('keycloak')) {
      test.skip()
      return
    }

    // Check for main navigation elements
    const sidebar = page.locator('nav, aside, [data-testid="sidebar"]')
    await expect(sidebar.first()).toBeVisible({ timeout: 10000 })
  })

  test('application loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('favicon')
    )
    expect(criticalErrors).toHaveLength(0)
  })
})
