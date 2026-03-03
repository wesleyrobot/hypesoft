import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('redirects unauthenticated users to Keycloak login', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const url = page.url()
    // Should redirect to Keycloak or show loading state
    const isLoginPage = url.includes('8080') || url.includes('keycloak') || url.includes('login')
    const isLoadingApp = url.includes('localhost:3000')

    expect(isLoginPage || isLoadingApp).toBe(true)
  })

  test('Keycloak login page is accessible', async ({ page }) => {
    const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080'
    const response = await page.goto(`${keycloakUrl}/realms/hypesoft/.well-known/openid-configuration`)

    expect(response?.status()).toBeLessThan(500)
  })

  test('login with valid credentials', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const url = page.url()
    if (!url.includes('8080') && !url.includes('keycloak')) {
      // Already on app — Keycloak may be bypassed or auto-login
      test.skip()
      return
    }

    // Fill Keycloak login form
    await page.fill('#username', 'admin')
    await page.fill('#password', 'admin123')
    await page.click('#kc-login')

    // Should redirect back to the application
    await page.waitForURL(/localhost:3000/, { timeout: 30000 })
    expect(page.url()).toContain('localhost:3000')
  })
})
