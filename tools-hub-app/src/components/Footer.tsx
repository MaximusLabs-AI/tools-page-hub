import {Wordmark} from './Logo'

export default function Footer() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft__top">
          <div className="ft__brand">
            <Wordmark white className="wordmark-w" />
            <p>
              Maximus Labs helps you rank on Google, ChatGPT, and beyond. Reach out today to build your
              AI-first, SEO-strong growth engine.
            </p>
          </div>
          <a className="btn btn--sky" href="https://maximuslabs.ai" target="_blank" rel="noreferrer">
            Contact Us <span className="arrow">→</span>
          </a>
        </div>
        <div className="ft__cols">
          <div>
            <h5>Services</h5>
            <ul>
              <li><a href="#">Generative Engine Optimization</a></li>
              <li><a href="#">Answer Engine Optimization</a></li>
              <li><a href="#">Agentic Commerce</a></li>
              <li><a href="#">B2B SEO</a></li>
            </ul>
          </div>
          <div>
            <h5>Industries</h5>
            <ul>
              <li><a href="#">SaaS | AI</a></li>
              <li><a href="#">Ecommerce</a></li>
              <li><a href="#">Fintech</a></li>
            </ul>
          </div>
          <div>
            <h5>Answer Engine Optimization</h5>
            <ul>
              <li><a href="#">What is AEO?</a></li>
              <li><a href="#">AEO vs SEO</a></li>
              <li><a href="#">Best AEO Tools</a></li>
            </ul>
          </div>
          <div>
            <h5>Generative Engine Optimization</h5>
            <ul>
              <li><a href="#">What is GEO?</a></li>
              <li><a href="#">Top GEO Tools</a></li>
              <li><a href="#">Peec AI Alternatives</a></li>
            </ul>
          </div>
          <div>
            <h5>Resources</h5>
            <ul>
              <li><a href="#">Blogs</a></li>
              <li><a href="#">AI Search 101</a></li>
              <li><a href="#">Industry Reports</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">Career</a></li>
            </ul>
          </div>
        </div>
        <div className="ft__bottom">
          <span>Copyright © 2025 Maximus Labs. All rights reserved.</span>
          <span className="ft__legal">
            <a href="#">Refund Policy</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
