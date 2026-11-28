import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  footerNavigation,
  primaryNavigation,
  SERVICE_NAV_LABEL,
} from '../../src/lib/site/site-navigation'
import { homepageDesign, homepageOfferings } from '../../src/lib/site/homepage-design'

describe('site navigation', () => {
  it('lists the top nav in order', () => {
    expect(primaryNavigation(true).map((link) => link.label)).toEqual([
      'Learn',
      'Toolkit',
      'Picks',
      'Ask Sara',
    ])
    expect(primaryNavigation(false)[2].label).toBe('Picks (soon)')
  })

  it('builds the footer groups', () => {
    expect(
      footerNavigation(true).map((group) => [group.title, group.links.map((link) => link.label)]),
    ).toEqual([
      ['Learn', ['Learn', 'Toolkit', 'Picks', 'Course (soon)']],
      ['Get help', ['Ask Sara (soon)', SERVICE_NAV_LABEL, 'Free CTO Starter Kit']],
      ['The fine print', ['Privacy', 'Terms', 'Disclaimer']],
    ])
  })

  it('names the paid service from one constant', () => {
    expect(SERVICE_NAV_LABEL).toBe('Work with Sara')
    const service = homepageOfferings.find((offer) => offer.ctaDestination === '/build-with-me')
    expect(service?.title).toBe(SERVICE_NAV_LABEL)
    const copy = JSON.stringify({ homepageDesign, homepageOfferings })
    expect(copy).not.toMatch(/have it reviewed|async reviews|independent reviews|see reviews/i)
  })
})

describe('site copy', () => {
  // Copy lives in these folders. Em dashes are off-brand everywhere in it.
  const roots = ['src/app/(site)', 'src/components/site', 'src/lib/site']
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const file = path.join(dir, name)
      if (statSync(file).isDirectory()) return walk(file)
      return /\.(ts|tsx)$/.test(name) ? [file] : []
    })
  const files = roots.flatMap((root) => walk(root))

  it('never uses em dashes', () => {
    for (const file of files) expect(readFileSync(file, 'utf8'), file).not.toContain('—')
  })
})
