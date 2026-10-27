import { describe, expect, it } from 'vitest'
import { Pages } from '../../src/collections/Pages'
import { Homepage } from '../../src/globals/Homepage'

describe('frontend CMS schema contract', () => {
  it('exposes every structured homepage field consumed by the frontend', () => {
    const names = Homepage.fields.flatMap((field) => 'name' in field ? [field.name] : [])
    for (const name of [
      'alwaysBuilding', 'audienceHeading', 'offeringsHeading', 'kitHeading',
      'consultingDescription', 'experienceHeading', 'experienceDescription',
      'closingHeading', 'closingDescription', 'hero', 'story', 'credibilityItems',
      'featuredResources', 'offerings',
    ]) {
      expect(names).toContain(name)
    }
    const arrays = {
      audienceItems: ['title', 'description'],
      kitContents: ['label'],
      audiences: ['label'],
      industries: ['label'],
      ventures: ['title', 'role', 'description'],
    }
    for (const [name, children] of Object.entries(arrays)) {
      const field = Homepage.fields.find((field) => 'name' in field && field.name === name)
      if (!field || field.type !== 'array') throw new Error(`Missing structured array: ${name}`)
      expect(field.fields.flatMap((child) => 'name' in child ? [child.name] : [])).toEqual(children)
    }
    expect(new Set(names).size).toBe(names.length)
  })

  it('requires explicit owner approval rather than publication alone', () => {
    const field = Pages.fields.find((field) => 'name' in field && field.name === 'ownerApproved')
    if (!field || field.type !== 'checkbox') throw new Error('Owner approval field is missing.')
    expect(field.defaultValue).toBe(false)
    expect(field.required).toBe(true)
    expect(field.access?.create).toBeTypeOf('function')
    expect(field.access?.update).toBeTypeOf('function')
  })
})
