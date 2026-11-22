import { describe, expect, it } from 'vitest'
import { Pages } from '../../src/collections/Pages'

describe('frontend CMS schema contract', () => {
  it('requires explicit owner approval rather than publication alone', () => {
    const field = Pages.fields.find((field) => 'name' in field && field.name === 'ownerApproved')
    if (!field || field.type !== 'checkbox') throw new Error('Owner approval field is missing.')
    expect(field.defaultValue).toBe(false)
    expect(field.required).toBe(true)
    expect(field.access?.create).toBeTypeOf('function')
    expect(field.access?.update).toBeTypeOf('function')
  })
})
