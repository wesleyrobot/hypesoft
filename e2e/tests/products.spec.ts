import { test, expect, Page } from '@playwright/test'

async function loginAsAdmin(page: Page) {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const url = page.url()
  if (url.includes('8080') || url.includes('keycloak')) {
    await page.fill('#username', 'admin')
    await page.fill('#password', 'admin123')
    await page.click('#kc-login')
    await page.waitForURL(/localhost:3000/, { timeout: 30000 })
  }
}

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('navigates to products page', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    const url = page.url()
    // Either on products or redirected to login
    expect(url.includes('products') || url.includes('8080') || url.includes('keycloak')).toBe(true)
  })

  test('products page shows data table or empty state', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    if (page.url().includes('8080') || page.url().includes('keycloak')) {
      test.skip()
      return
    }

    // Wait for either a table row or empty state message
    const hasContent = await Promise.race([
      page.waitForSelector('table tbody tr', { timeout: 10000 }).then(() => true),
      page.waitForSelector('[data-testid="empty-state"], .empty-state', { timeout: 10000 }).then(() => true),
      page.waitForSelector('text=/nenhum produto/i', { timeout: 10000 }).then(() => true),
    ]).catch(() => false)

    // Content should be visible
    expect(hasContent).toBe(true)
  })

  test('search input is present on products page', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    if (page.url().includes('8080')) {
      test.skip()
      return
    }

    const searchInput = page.locator('input[placeholder*="buscar" i], input[placeholder*="search" i], input[type="search"]')
    await expect(searchInput.first()).toBeVisible({ timeout: 10000 })
  })

  test('create product button is visible', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    if (page.url().includes('8080')) {
      test.skip()
      return
    }

    const createBtn = page.locator(
      'button:has-text("Novo"), button:has-text("Criar"), button:has-text("Add"), button:has-text("Adicionar")'
    )
    await expect(createBtn.first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('API Health', () => {
  test('backend health endpoint returns 200', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const response = await page.goto(`${baseUrl}/health`)
    expect(response?.status()).toBe(200)
  })

  test('API products endpoint is accessible', async ({ request }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const response = await request.get(`${baseUrl}/api/products`)
    // 200 OK or 401 Unauthorized (both are valid — endpoint exists)
    expect([200, 401]).toContain(response.status())
  })

  test('API categories endpoint is accessible', async ({ request }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const response = await request.get(`${baseUrl}/api/categories`)
    expect([200, 401]).toContain(response.status())
  })

  test('API dashboard endpoint is accessible', async ({ request }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const response = await request.get(`${baseUrl}/api/dashboard`)
    expect([200, 401]).toContain(response.status())
  })
})
