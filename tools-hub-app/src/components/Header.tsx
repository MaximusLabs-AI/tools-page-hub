import Link from 'next/link'
import {Wordmark} from './Logo'

/**
 * Minimal header. This hub is embedded under the main maximuslabs.ai site (its
 * "Tools" button links here), so it carries no competing navbar — just the
 * brand mark returning to the collection.
 */
export default function Header() {
  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <Link className="brand" href="/" aria-label="MaximusLabs tools">
          <Wordmark />
        </Link>
        <a className="hdr__site" href="https://maximuslabs.ai" target="_blank" rel="noreferrer">
          maximuslabs.ai ↗
        </a>
      </div>
    </header>
  )
}
