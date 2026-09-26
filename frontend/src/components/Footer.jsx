import './Footer.css'

export default function Footer({
  companyName = 'WildCanvas LLC',
}) {
  return (
    <footer className="wild-site-footer" role="contentinfo">
      {/* Main Footer with Signature Full-Width Architectural Wordmark */}
      <div className="wild-footer-bottom-wrap">
        <div className="wild-footer-inner">
          {/* Giant WildCanvas Wordmark SVG */}
          <div className="wild-giant-logo-wrap">
            <a href="/" className="wild-giant-logo-link" aria-label="WildCanvas Home">
              <svg
                width="100%"
                viewBox="0 0 1100 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="wild-giant-svg"
                preserveAspectRatio="xMidYMid meet"
              >
                <text
                  x="50%"
                  y="55%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="currentColor"
                  fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
                  fontWeight="800"
                  letterSpacing="-0.045em"
                  fontSize="175"
                >
                  WildCanvas
                </text>
              </svg>
            </a>
          </div>

          {/* Bottom Bar: Copyright & Links */}
          <div className="wild-footer-meta">
            <p className="wild-footer-company">© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
            <div className="wild-footer-links">
              <a href="#privacy" className="wild-footer-link">Privacy</a>
              <a href="#terms" className="wild-footer-link">Terms</a>
              <a href="#support" className="wild-footer-link">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
