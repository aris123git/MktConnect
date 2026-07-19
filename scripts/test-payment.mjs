import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173'
const OUT = '/opt/cursor/artifacts/payment-tests'
mkdirSync(OUT, { recursive: true })

const results = []

function pass(name, detail = '') {
  results.push({ name, ok: true, detail })
  console.log(`✅ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail })
  console.error(`❌ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function assertVisible(page, text, label) {
  const el = page.getByText(text, { exact: false }).first()
  await el.waitFor({ state: 'visible', timeout: 8000 })
  pass(label, text)
}

async function clearSession(page) {
  await page.addInitScript(() => {
    localStorage.removeItem('mktconnect.mikrotik.v1')
  })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.removeItem('mktconnect.mikrotik.v1'))
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  try {
    await clearSession(page)
    await assertVisible(page, 'Welcome to Starlink Hotspot', 'Portal loads')

    await page.getByRole('button', { name: /6 Hours/i }).first().click()
    await page.waitForTimeout(300)

    const summaryPackage = page
      .locator('aside')
      .filter({ hasText: 'Order Summary' })
      .filter({ visible: true })
      .first()
    await summaryPackage.locator('dd', { hasText: /^6 Hours$/ }).waitFor({ state: 'visible' })
    await summaryPackage.getByText('150 FCFA', { exact: true }).waitFor({ state: 'visible' })
    pass('Package selection updates summary', '6 Hours / 150 FCFA')

    const payBtn = summaryPackage.getByRole('button', { name: /PAY & CONNECT/i })
    if (await payBtn.isDisabled()) {
      pass('PAY disabled before payment method')
    } else {
      fail('PAY should be disabled before payment method')
    }

    await page.getByRole('button', { name: /Orange Money/i }).first().click()
    await page.waitForTimeout(250)
    await assertVisible(page, 'Orange Money checkout', 'Mobile Money form appears')

    if (await payBtn.isDisabled()) pass('PAY disabled without phone number')
    else fail('PAY should stay disabled without phone')

    await page.locator('#phone').fill('70')
    if (await payBtn.isDisabled()) pass('PAY disabled for short phone number')
    else fail('PAY should reject short phone number')

    await page.locator('#phone').fill('70 12 34 56')
    if (!(await payBtn.isDisabled())) pass('PAY enabled with valid phone')
    else fail('PAY should enable with valid phone')

    await page.screenshot({ path: `${OUT}/01-orange-money-ready.png`, fullPage: true })

    await page.getByRole('button', { name: /^Continue$/i }).click()
    await page.waitForURL('**/session', { timeout: 15000 })
    await assertVisible(page, 'You are online', 'Orange Money → MikroTik session')
    await assertVisible(page, 'Orange Money', 'Session shows payment method')
    await page.getByText('6 Hours').first().waitFor({ state: 'visible' })
    pass('Session shows package', '6 Hours')
    await page.screenshot({ path: `${OUT}/02-orange-money-success.png` })

    // Clear for Pay on Site
    await page.evaluate(() => localStorage.removeItem('mktconnect.mikrotik.v1'))
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /1 Day/i }).first().click()
    await page.getByRole('button', { name: /Pay on Site/i }).first().click()
    await page.waitForTimeout(250)

    await assertVisible(
      page,
      'You will pay directly to the hotspot owner',
      'Pay on Site message shown',
    )

    const summary = page
      .locator('aside')
      .filter({ hasText: 'Order Summary' })
      .filter({ visible: true })
      .first()
    const payOnSiteBtn = summary.getByRole('button', { name: /PAY & CONNECT/i })
    if (!(await payOnSiteBtn.isDisabled())) pass('PAY enabled for Pay on Site without phone')
    else fail('PAY should enable for Pay on Site')

    await page.screenshot({ path: `${OUT}/03-pay-on-site-ready.png`, fullPage: true })
    await payOnSiteBtn.click()
    await page.waitForURL('**/session', { timeout: 15000 })
    await assertVisible(page, 'You are online', 'Pay on Site → MikroTik session')
    await assertVisible(page, 'Pay on Site', 'Session shows Pay on Site')
    await assertVisible(page, '200 FCFA', 'Session shows amount')
    await page.screenshot({ path: `${OUT}/04-pay-on-site-success.png` })

    await page.evaluate(() => localStorage.removeItem('mktconnect.mikrotik.v1'))
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /7 Days/i }).first().click()
    await page.locator('button').filter({ hasText: 'Fast mobile payment with Wave' }).click()
    await page.locator('#phone').fill('76001122')
    await page.getByRole('button', { name: /^Continue$/i }).click()
    await page.waitForURL('**/session', { timeout: 15000 })
    await assertVisible(page, 'Wave', 'Wave payment → session')
    const amountText = await page.locator('body').innerText()
    if (amountText.includes('1') && amountText.includes('000') && amountText.includes('FCFA')) {
      pass('Wave amount formatted', '1000 FCFA')
    } else {
      fail('Wave amount formatted', amountText.slice(0, 200))
    }
    await page.screenshot({ path: `${OUT}/05-wave-success.png` })

    await page.evaluate(() => localStorage.removeItem('mktconnect.mikrotik.v1'))
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Moov Money/i }).first().click()
    await assertVisible(page, 'Moov Money checkout', 'Moov Money form')
    await page.getByRole('button', { name: /Telecel Cash/i }).first().click()
    await assertVisible(page, 'Telecel Cash checkout', 'Telecel Cash form')
    pass('All mobile money methods selectable')
  } catch (error) {
    await page.screenshot({ path: `${OUT}/failure.png`, fullPage: true }).catch(() => {})
    fail('Unhandled error', error instanceof Error ? error.message : String(error))
  } finally {
    await browser.close()
  }

  const failed = results.filter((r) => !r.ok)
  console.log('\n——— Payment test summary ———')
  console.log(`Passed: ${results.filter((r) => r.ok).length}`)
  console.log(`Failed: ${failed.length}`)
  if (failed.length) {
    for (const item of failed) console.log(` - ${item.name}: ${item.detail}`)
    process.exit(1)
  }
}

run()
