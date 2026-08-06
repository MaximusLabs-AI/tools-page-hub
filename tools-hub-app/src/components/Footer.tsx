import {Wordmark} from './Logo'

// Exact replica of the live maximuslabs.ai footer: six columns, with INDUSTRIES
// stacked under SERVICES in the first column. Absolute links to the main domain.
const SITE = 'https://www.maximuslabs.ai'
const abs = (p: string) => (p.startsWith('http') ? p : SITE + p)

type Group = {heading: string; links: [string, string][]}

// Each entry is one visual column; a column can hold more than one group.
const COLUMNS: Group[][] = [
  [
    {
      heading: 'Services',
      links: [
        ['Generative Engine Optimization', '/services/geo'],
        ['Answer Engine Optimization', '/services/aeo'],
        ['Agentic Commerce', '/services/agentic-commerce'],
        ['B2B SEO', '/services/b2b-seo'],
      ],
    },
    {
      heading: 'Industries',
      links: [
        ['SaaS | AI', '/services/industries/ai-saas'],
        ['Ecommerce', '/services/industries/ecommerce'],
        ['Fintech', '/services/industries/financial'],
      ],
    },
  ],
  [
    {
      heading: 'Answer Engine Optimization',
      links: [
        ['What is AEO?', '/answer-engine-optimizations/aeo'],
        ['AEO vs SEO', '/answer-engine-optimizations/aeo-vs-seo'],
        ['Best AEO Agencies', '/answer-engine-optimizations/best-aeo-agencies'],
        ['Enterprise AEO Agencies', '/answer-engine-optimizations/enterprise-aeo-agencies'],
        ['Ecommerce AEO Agencies', '/answer-engine-optimizations/ecommerce-aeo-geo-agencies'],
        ['Best AEO Tools', '/answer-engine-optimizations/aeo-tools-comparison'],
        ['AEO Implementation Checklist', '/answer-engine-optimizations/aeo-implementation-checklist-50-best-practices-ai-search'],
        ['AI Search Tracking Tools', '/answer-engine-optimizations/ai-search-visibility-brand-mentions-tracking-tools'],
      ],
    },
  ],
  [
    {
      heading: 'Generative Engine Optimization',
      links: [
        ['What is GEO?', '/blog/what-is-generative-engine-optimization-geo'],
        ['GEO vs Traditional SEO', '/generative-engine-optimization/geo-vs-traditional-seo-comparison'],
        ['Best GEO Agencies', '/generative-engine-optimization/best-geo-agency-services'],
        ['GEO Strategy Framework', '/generative-engine-optimization/geo-strategy-framework'],
        ['GEO Case Studies', '/generative-engine-optimization/geo-case-studies-success-stories'],
        ['GEO Market Analysis 2026', '/generative-engine-optimization/geo-market-analysis'],
        ['Top GEO Tools', '/generative-engine-optimization/top-geo-tools-platforms'],
        ['Technical GEO Implementation', '/generative-engine-optimization/technical-geo-implementation'],
        ['Peec AI Alternatives', '/answer-engine-optimizations/top-peec-ai-alternatives-competitors'],
      ],
    },
  ],
  [
    {
      heading: 'Tools',
      links: [
        ['AI Content Humanizer', '/resources/free-tools/ai-content-humanizer'],
        ['AI Content Optimizer', '/resources/free-tools/ai-content-optimizer'],
        ['AI Crawlability Checker', '/resources/free-tools/ai-crawlability-checker'],
        ['LLM Text Generator', '/resources/free-tools/llms-txt-generator'],
      ],
    },
  ],
  [
    {
      heading: 'Resources',
      links: [
        ['Blogs', '/blog'],
        ['AI Search 101', '/ai-search-101'],
        ['Industry Reports', '/resources/reports'],
        ['ChatGPT SEO Guide', '/services/platforms/chatgpt'],
        ['Perplexity SEO Guide', '/services/platforms/perplexity'],
        ['Gemini Guide', '/services/platforms/google-ai-gemini'],
        ['Claude Guide', '/services/platforms/anthropic-claude'],
      ],
    },
  ],
  [
    {
      heading: 'Company',
      links: [
        ['About Us', '/company/about-us'],
        ['Case Studies', '/company/case-studies/case-studies-collection'],
        ['Career', '/company/careers'],
      ],
    },
  ],
]

const LEGAL: [string, string][] = [
  ['Refund Policy', '/others/refund-policy'],
  ['Privacy Policy', '/others/privacy-policy'],
  ['Terms of Service', '/others/terms-of-service'],
]

export default function Footer() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft__top">
          <div className="ft__brand">
            <a href={SITE} aria-label="MaximusLabs">
              <Wordmark />
            </a>
            <p>
              Maximus Labs helps you rank on Google, ChatGPT, and beyond. Reach out today to build your
              AI-first, SEO-strong growth engine.
            </p>
          </div>
          <div className="ft__actions">
            <a className="btn--contact-ft" href={abs('/contact-us')}>
              <span className="btn__circle" aria-hidden="true">→</span>
              Contact Us
            </a>
            <a
              className="ft__li"
              href="https://www.linkedin.com/company/maximus-labs-ai/"
              target="_blank"
              rel="noreferrer"
              aria-label="MaximusLabs on LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
                <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.83v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V21H17.5v-5.44c0-1.3-.02-2.97-1.81-2.97-1.82 0-2.1 1.42-2.1 2.88V21H9z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="ft__cols">
          {COLUMNS.map((column, i) => (
            <div className="ft__col" key={i}>
              {column.map((group) => (
                <div className="ft__grp" key={group.heading}>
                  <h5>{group.heading}</h5>
                  <ul>
                    {group.links.map(([label, href]) => (
                      <li key={href}><a href={abs(href)}>{label}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="ft__bottom">
          <span>Copyright © 2025 Maximus Labs | All rights reserved.</span>
          <span className="ft__legal">
            {LEGAL.map(([label, href]) => (
              <a key={href} href={abs(href)}>{label}</a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  )
}
