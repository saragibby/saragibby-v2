import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  FormPolicyProvider,
  InquiryForm,
  SignupForm,
} from '../../src/components/site/forms'
import { closedFormNotice, formNotices } from '../../src/lib/site/form-availability'

const open = { deliveryEnabled: true, enabled: true, kitReady: true }

function render(policy: typeof open, form: ReactNode) {
  return renderToStaticMarkup(<FormPolicyProvider {...policy}>{form}</FormPolicyProvider>)
}

describe('form availability notices', () => {
  it('closes every form while email delivery is off', () => {
    const closed = { ...open, deliveryEnabled: false }
    expect(closedFormNotice(closed, 'signup')).toBe('signup')
    expect(closedFormNotice(closed, 'kit')).toBe('signup')
    expect(closedFormNotice(closed, 'inquiry')).toBe('inquiry')
  })

  it('uses the same notices while privacy approval is pending', () => {
    const pending = { ...open, enabled: false }
    expect(closedFormNotice(pending, 'kit')).toBe('signup')
    expect(closedFormNotice(pending, 'inquiry')).toBe('inquiry')
  })

  it('only holds kit requests back when the kit is not ready', () => {
    const noKit = { ...open, kitReady: false }
    expect(closedFormNotice(noKit, 'kit')).toBe('kit')
    expect(closedFormNotice(noKit, 'signup')).toBeNull()
    expect(closedFormNotice(noKit, 'inquiry')).toBeNull()
    expect(closedFormNotice(open, 'kit')).toBeNull()
  })

  it('shows the Work with Sara inquiry notice with a mailto fallback when the flag is off', () => {
    const html = render({ ...open, deliveryEnabled: false }, <InquiryForm />)
    expect(html).toContain('Online inquiries are almost ready. I’m still testing the pipes. Until then, email ')
    expect(html).toContain('<a href="mailto:heythere@saragibby.com">heythere@saragibby.com</a>')
    expect(html).not.toContain('<form')
  })

  it('swaps the notice for the form when the flag is on', () => {
    const closed = render({ ...open, deliveryEnabled: false }, <SignupForm source="test" />)
    expect(closed).toContain(formNotices.signup)
    expect(closed).not.toContain('<form')
    for (const form of [
      <SignupForm key="signup" source="test" />,
      <InquiryForm key="inquiry" />,
    ]) {
      const html = render(open, form)
      expect(html).toContain('<form')
      expect(html).not.toContain('class="notice')
    }
  })

  it('retires the old wording everywhere', () => {
    for (const notice of Object.values(formNotices)) {
      expect(notice).not.toMatch(/not open yet|Email delivery is being connected/)
    }
  })
})
