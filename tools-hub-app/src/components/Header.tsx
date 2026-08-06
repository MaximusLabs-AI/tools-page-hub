'use client'

import {useState} from 'react'
import {LogoMark} from './Logo'

// The hub is served under maximuslabs.ai (via URL rewrite), so this header is an
// exact replica of the live maximuslabs.ai navigation. Links are absolute to the
// main domain so they work whether the page is embedded or viewed standalone.
const SITE = 'https://www.maximuslabs.ai'
const abs = (p: string) => (p.startsWith('http') ? p : SITE + p)

type Section = {heading?: string; links: [string, string][]}
// One nav__grp per column. A column can stack more than one headed section
// (e.g. the live "Resources" menu's second column stacks "Tools" above
// "Free AI Tools" within a single column, rather than each getting its own).
type Column = Section[]
type NavItem = {label: string; columns: Column[]}

const NAV: NavItem[] = [
  {
    label: 'Services',
    columns: [
      [
        {
          heading: 'Expertise',
          links: [
            ['Generative Engine Optimisation', '/services/geo'],
            ['Answer Engine Optimisation', '/services/aeo'],
            ['Agentic Commerce', '/services/agentic-commerce'],
            ['B2B SEO', '/services/b2b-seo'],
          ],
        },
      ],
      [
        {
          heading: 'Platforms',
          links: [
            ['ChatGPT', '/services/platforms/chatgpt'],
            ['Gemini', '/services/platforms/google-ai-gemini'],
            ['Perplexity', '/services/platforms/perplexity'],
            ['Google AI Mode', '/services/platforms/best-google-ai-optimization-agency---built-for-revenue-not-vanity-metrics-2026'],
            ['Claude', '/services/platforms/anthropic-claude'],
          ],
        },
      ],
    ],
  },
  {
    label: 'Resources',
    columns: [
      [
        {
          heading: 'Learn',
          links: [
            ['AI Search 101', '/ai-search-101'],
            ['Blogs', '/blog'],
            ['Industry Reports', '/resources/reports'],
          ],
        },
      ],
      [
        {heading: 'Tools', links: [['AI Tool Directory', '/resources/ai-tool-directory']]},
        {
          heading: 'Free AI Tools',
          links: [
            ['AI Content Humanizer', '/resources/free-tools/ai-content-humanizer'],
            ['AI Content Optimizer', '/resources/free-tools/ai-content-optimizer'],
            ['AI Crawlability Checker', '/resources/free-tools/ai-crawlability-checker'],
            ['LLM Text Generator', '/resources/free-tools/llms-txt-generator'],
          ],
        },
      ],
    ],
  },
  {
    label: 'Industries',
    columns: [
      [
        {
          links: [
            ['AI | SaaS', '/services/industries/ai-saas'],
            ['Fintech', '/services/industries/financial'],
            ['Ecommerce', '/services/industries/ecommerce'],
          ],
        },
      ],
    ],
  },
  {
    label: 'Company',
    columns: [
      [
        {
          links: [
            ['About Us', '/company/about-us'],
            ['Case Studies', '/company/case-studies/case-studies-collection'],
            ['Career', '/company/careers'],
          ],
        },
      ],
    ],
  },
]

function Caret() {
  return (
    <svg className="nav__caret" viewBox="0 0 10 6" aria-hidden="true">
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <a className="brand" href={SITE} aria-label="MaximusLabs">
          <LogoMark />
        </a>

        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => (
            <div className="nav__item" key={item.label}>
              <button className="nav__btn" type="button">
                {item.label}
                <Caret />
              </button>
              <div className={`nav__panel${item.columns.length > 1 ? ' nav__panel--multi' : ''}`}>
                {item.columns.map((column, ci) => (
                  <div className="nav__col" key={ci}>
                    {column.map((section, si) => (
                      <div className="nav__grp" key={section.heading || si}>
                        {section.heading && <h4>{section.heading}</h4>}
                        {section.links.map(([label, href]) => (
                          <a key={href} href={abs(href)}>{label}</a>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="hdr__cta">
          <a className="hdr__pricing" href={abs('/pricing')}>Pricing</a>
          <a className="btn--contact" href={abs('/contact-us')}>Contact Us</a>
        </div>

        <button
          className={`hdr__burger${open ? ' is-open' : ''}`}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="hdr__mobile">
          {NAV.map((item) => (
            <div className="hdr__mgroup" key={item.label}>
              <div className="hdr__mlabel">{item.label}</div>
              {item.columns.flat().flatMap((section) => section.links).map(([label, href]) => (
                <a key={href} href={abs(href)}>{label}</a>
              ))}
            </div>
          ))}
          <div className="hdr__mactions">
            <a className="hdr__mlink" href={abs('/pricing')}>Pricing</a>
            <a className="btn--contact" href={abs('/contact-us')}>Contact Us</a>
          </div>
        </div>
      )}
    </header>
  )
}
