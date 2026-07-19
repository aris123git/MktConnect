import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173'
const OUT = '/opt/cursor/artifacts/mikrotik-tests'
mkdirSync(OUT, { recursive: true })

const results = []
const pass = (name, detail = '') => {
  results.push({ name, ok: true, detail })
  console.log(`✅ ${name}${detail ? ` — ${detail}` : ''}`)
}
const fail = (name, detail = '') => {
  results.push({ name, ok: false, detail })
  console.error(`❌ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function clearMikrotik(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.removeItem('mktconnect.mikrotik.v1'))
  await page.reload({ waitUntil: 'networkidle' })
}

async function payForTwoHours(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /2 Hours/i }).first().click()
  await page.getByRole('button', { name: /Orange Money/i }).first().click()
  await page.locator('#phone').fill('70123456')
  await page.getByRole('button', { name: /^Continue$/i }).click()
  await page.waitForURL('**/session', { timeout: 15000 })
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  try {
    await clearMikrotik(page)
    await payForTwoHours(page)

    await page.getByText('You are online').waitFor({ state: 'visible' })
    pass('Payment grants MikroTik session')

    const remaining = page.getByTestId('remaining-time')
    await remaining.waitFor({ state: 'visible' })
    const initialText = (await remaining.innerText()).trim()
    if (initialText !== '0s' && !initialText.includes('0s')) {
      pass('Remaining time starts above zero', initialText)
    } else {
      fail('Remaining time starts above zero', initialText)
    }

    await page.getByText(/2h package ≈ 16s in demo clock/i).waitFor({ state: 'visible' })
    pass('Demo clock bound to paid 2h package')

    await page.getByText(/hard limit|Purchased: 2 Hours|Ceiling/i).first().waitFor({
      state: 'visible',
    })
    pass('UI shows purchased duration ceiling')

    await page.screenshot({ path: `${OUT}/01-session-active.png`, fullPage: true })

    // Portal must block a second purchase while session is active
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.getByText(/MikroTik session active/i).waitFor({ state: 'visible' })
    const summary = page
      .locator('aside')
      .filter({ hasText: 'Order Summary' })
      .filter({ visible: true })
      .first()
    const payBtn = summary.getByRole('button', { name: /PAY & CONNECT/i })
    if (await payBtn.isDisabled()) {
      pass('New purchase blocked while session active')
    } else {
      fail('New purchase blocked while session active')
    }
    await page.screenshot({ path: `${OUT}/02-portal-blocked.png`, fullPage: true })

    // Wait for accelerated expiry (2h => 16s + buffer)
    await page.goto(`${BASE}/session`, { waitUntil: 'networkidle' })
    await page.getByText('Session ended', { timeout: 25000 }).waitFor({ state: 'visible' })
    pass('Session auto-expires at purchased duration')

    const finalRemaining = (await page.getByTestId('remaining-time').innerText()).trim()
    if (finalRemaining === '0s') {
      pass('Remaining time hits hard zero — no overrun')
    } else {
      fail('Remaining time hits hard zero — no overrun', finalRemaining)
    }
    await page.screenshot({ path: `${OUT}/03-session-expired.png`, fullPage: true })

    // After expiry, user can buy again
    await page.goto(BASE, { waitUntil: 'networkidle' })
    const activeBanner = page.getByText(/MikroTik session active/i)
    if ((await activeBanner.count()) === 0) {
      pass('Portal allows repurchase after expiry')
    } else {
      fail('Portal allows repurchase after expiry')
    }

    // Admin live sessions list
    await page.goto(`${BASE}/admin/users`, { waitUntil: 'networkidle' })
    await page.getByText(/Live MikroTik simulation sessions/i).waitFor({ state: 'visible' })
    await page.getByText('2 Hours').first().waitFor({ state: 'visible' })
    pass('Admin Connected Users shows MikroTik session')
    await page.screenshot({ path: `${OUT}/04-admin-users.png`, fullPage: true })

    // Pure logic check via page evaluate against localStorage math
    const logic = await page.evaluate(() => {
      const raw = localStorage.getItem('mktconnect.mikrotik.v1')
      if (!raw) return { ok: false, reason: 'missing store' }
      const store = JSON.parse(raw)
      const session = store.sessions[0]
      if (!session) return { ok: false, reason: 'missing session' }
      const granted = session.grantedMs
      const span =
        new Date(session.expiresAt).getTime() - new Date(session.connectedAt).getTime()
      const expected = session.durationHours * 8000
      return {
        ok: granted === expected && span === expected && session.durationHours === 2,
        granted,
        span,
        expected,
        durationHours: session.durationHours,
        amountPaid: session.amountPaid,
      }
    })
    if (logic.ok && logic.amountPaid === 100) {
      pass('Paid amount maps to exact duration ceiling', `2h / ${logic.expected}ms`)
    } else {
      fail('Paid amount maps to exact duration ceiling', JSON.stringify(logic))
    }
  } catch (error) {
    await page.screenshot({ path: `${OUT}/failure.png`, fullPage: true }).catch(() => {})
    fail('Unhandled error', error instanceof Error ? error.message : String(error))
  } finally {
    await browser.close()
  }

  const failed = results.filter((r) => !r.ok)
  writeFileSync(
    `${OUT}/summary.json`,
    JSON.stringify({ passed: results.length - failed.length, failed: failed.length, results }, null, 2),
  )
  console.log('\n——— MikroTik simulation summary ———')
  console.log(`Passed: ${results.filter((r) => r.ok).length}`)
  console.log(`Failed: ${failed.length}`)
  if (failed.length) process.exit(1)
}

run()
