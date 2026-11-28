import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LearnHub, ToolkitHub } from '../../src/components/site/resource-hubs'
import { Resources } from '../../src/collections/Resources'
import {
  filterByPillar,
  groupToolkit,
  resourceAccessLabel,
  resourceHub,
  resourceLastCheckedLabel,
  resourcePath,
  resourcesForHub,
  resourceTypes,
  toResourceSummaries,
  toResourceSummary,
  type ResourceSummary,
} from '../../src/lib/site/resources'

function item(overrides: Partial<ResourceSummary>): ResourceSummary {
  return {
    title: 'An item',
    slug: 'an-item',
    resourceType: 'guide',
    pillar: 'time-back',
    access: 'free',
    lastChecked: '2026-11-20T00:00:00.000Z',
    excerpt: 'A short excerpt.',
    ...overrides,
  }
}

describe('resource hubs', () => {
  it('sends guides, articles and videos to Learn and the rest to the Toolkit', () => {
    expect(resourceTypes.filter((type) => type.hub === 'learn').map((type) => type.value)).toEqual([
      'guide',
      'article',
      'video',
    ])
    for (const type of ['template', 'checklist', 'prompt', 'calculator', 'how-to', 'agent'])
      expect(resourceHub(type)).toBe('toolkit')
    expect(resourceHub('tutorial')).toBeUndefined()
    expect(resourcePath({ slug: 'quote-checklist', resourceType: 'checklist' })).toBe(
      '/toolkit/quote-checklist',
    )
    expect(resourcePath({ slug: 'ai-basics', resourceType: 'video' })).toBe('/learn/ai-basics')
  })

  it('keeps the Payload type options in step with the hubs', () => {
    const field = Resources.fields
      .flatMap((field) => ('fields' in field && field.type === 'row' ? field.fields : [field]))
      .find((field) => 'name' in field && field.name === 'resourceType')
    if (!field || field.type !== 'select') throw new Error('resourceType select is missing.')
    expect(field.options.map((option) => (typeof option === 'string' ? option : option.value))).toEqual(
      resourceTypes.map((type) => type.value),
    )
  })

  it('skips records that cannot be linked', () => {
    expect(toResourceSummary({ slug: 'ok', resourceType: 'prompt', title: 'Ok' })).toMatchObject({
      slug: 'ok',
      access: null,
    })
    expect(toResourceSummary({ slug: 'Not A Slug', resourceType: 'guide' })).toBeUndefined()
    expect(toResourceSummary({ slug: 'old', resourceType: 'tutorial' })).toBeUndefined()
    expect(toResourceSummaries([{ slug: 'a', resourceType: 'guide' }, {}])).toHaveLength(1)
  })

  it('labels access and the last-checked month', () => {
    expect(resourceAccessLabel('free')).toBe('Free')
    expect(resourceAccessLabel('email')).toBe('Free with email')
    expect(resourceAccessLabel(null)).toBe('Free')
    expect(resourceLastCheckedLabel('2026-11-20T00:00:00.000Z')).toBe('Last checked Nov 2026')
    expect(resourceLastCheckedLabel(null)).toBeUndefined()
  })

  it('groups Toolkit items in section order and hides empty sections', () => {
    const sections = groupToolkit([
      item({ slug: 'p', resourceType: 'prompt' }),
      item({ slug: 'c', resourceType: 'checklist' }),
      item({ slug: 't', resourceType: 'template' }),
    ])
    expect(sections.map((section) => section.title)).toEqual(['Templates & checklists', 'Prompts'])
    expect(sections[0].items.map((resource) => resource.slug)).toEqual(['c', 't'])
    expect(groupToolkit([])).toEqual([])
  })

  it('splits by hub and filters by pillar', () => {
    const all = [
      item({ slug: 'g', pillar: 'grow' }),
      item({ slug: 'b', pillar: 'dont-get-burned' }),
      item({ slug: 'x', resourceType: 'prompt' }),
    ]
    const learn = resourcesForHub(all, 'learn')
    expect(learn.map((resource) => resource.slug)).toEqual(['g', 'b'])
    expect(filterByPillar(learn, 'grow').map((resource) => resource.slug)).toEqual(['g'])
    expect(filterByPillar(learn, undefined)).toHaveLength(2)
  })
})

describe('Learn page', () => {
  it('shows the workbench note, the kit button and the course card when empty', () => {
    const html = renderToStaticMarkup(<LearnHub resources={[]} pillar={undefined} />)
    expect(html).toContain('The first guides are on the workbench. Start with the free CTO Starter Kit.')
    expect(html).toContain('href="/newsletter"')
    expect(html).toContain('Get the Free CTO Starter Kit')
    expect(html).toContain('<a href="/course">The course (soon)</a>')
    expect(html).not.toContain('aria-label="Pillar"')
  })

  it('lists items with a pillar filter, and says so when a filter matches nothing', () => {
    const resources = [item({ title: 'Reading a quote', slug: 'reading-a-quote', pillar: 'dont-get-burned' })]
    const html = renderToStaticMarkup(<LearnHub resources={resources} pillar={undefined} />)
    expect(html).toContain('<a href="/learn/reading-a-quote">Reading a quote</a>')
    expect(html).toContain('Don’t get burned')
    expect(html).toContain('href="/learn?pillar=grow"')
    expect(html).toContain('The course (soon)')

    const none = renderToStaticMarkup(<LearnHub resources={resources} pillar="grow" />)
    expect(none).toContain('No guides match that pillar.')
    expect(none).not.toContain('Reading a quote')
  })
})

describe('resource details', () => {
  it('leaves out the details list when a Learn item has no pillar or date', () => {
    const html = renderToStaticMarkup(
      <LearnHub resources={[item({ pillar: null, lastChecked: null })]} pillar={undefined} />,
    )
    expect(html).not.toContain('aria-label="Details"')
  })
})

describe('Toolkit page', () => {
  it('shows only the kit and a coming-soon note when everything is empty', () => {
    const html = renderToStaticMarkup(<ToolkitHub resources={[]} />)
    expect(html).toContain('The Free CTO Starter Kit')
    expect(html).toContain('One hour, one busywork task, one plan you can actually use.')
    expect(html).toContain('More tools coming soon.')
    expect(html).not.toContain('<h2 id="toolkit-')
  })

  it('shows type, pillar, access and last checked on each item', () => {
    const html = renderToStaticMarkup(
      <ToolkitHub
        resources={[
          item({
            title: 'Quote checklist',
            slug: 'quote-checklist',
            resourceType: 'checklist',
            pillar: 'dont-get-burned',
            access: 'email',
            lastChecked: '2026-10-02T00:00:00.000Z',
          }),
        ]}
      />,
    )
    expect(html).toContain('Templates &amp; checklists')
    expect(html).not.toContain('Calculators (soon)')
    expect(html).not.toContain('More tools coming soon.')
    expect(html).toContain('<p class="eyebrow">Checklist</p>')
    expect(html).toContain('Don’t get burned')
    expect(html).toContain('Free with email')
    expect(html).toContain('<time dateTime="2026-10-02">Last checked Oct 2026</time>')
  })
})
