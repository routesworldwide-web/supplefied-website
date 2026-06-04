export default function ComingSoon() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .cs-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9f6;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%);
        }

        .jar-bg {
          position: absolute;
          width: min(520px, 78vw);
          height: min(660px, 95vh);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          user-select: none;
        }

        .content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 24px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 400;
          color: #7a8a7a;
          margin-bottom: 32px;
          backdrop-filter: blur(10px);
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6dbf8a;
          animation: pulse 2.4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        .headline {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(52px, 9vw, 88px);
          font-weight: 400;
          color: #161a14;
          line-height: 1.05;
          letter-spacing: -0.025em;
          margin-bottom: 22px;
        }

        .headline em {
          font-style: italic;
          color: #5a7a5a;
        }

        .subtext {
          font-size: 15px;
          font-weight: 300;
          color: #8a9688;
          line-height: 1.7;
          max-width: 360px;
        }

        .footer-note {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          color: #bbc4b8;
          letter-spacing: 0.06em;
          white-space: nowrap;
          z-index: 10;
        }

        @media (max-width: 640px) {
          .headline {
            font-size: clamp(46px, 16vw, 64px);
          }

          .subtext {
            max-width: 300px;
            font-size: 14px;
          }

          .footer-note {
            bottom: 18px;
          }
        }
      `}</style>

      <div className="cs-root">
        <div className="dot-grid" />

        <div className="jar-bg">
          <svg
            viewBox="0 0 320 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%", opacity: 0.14 }}
          >
            {/* Lid top */}
            <ellipse cx="160" cy="72" rx="88" ry="18" fill="#7BBF8A" />

            {/* Lid body */}
            <rect x="72" y="72" width="176" height="38" rx="6" fill="#8FCC9E" />

            {/* Lid bottom edge */}
            <ellipse cx="160" cy="110" rx="88" ry="16" fill="#7BBF8A" />

            {/* Jar body */}
            <path
              d="M76 118 Q68 130 66 180 L64 310 Q64 350 160 354 Q256 350 256 310 L254 180 Q252 130 244 118 Z"
              fill="#D6EDD9"
              stroke="#B8DABC"
              strokeWidth="1.5"
            />

            {/* Jar shine */}
            <path
              d="M84 138 Q78 200 78 270"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M96 132 Q90 165 91 200"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.25"
            />

            {/* Label background */}
            <path
              d="M80 172 Q78 185 78 210 L78 280 Q78 296 160 298 Q242 296 242 280 L242 210 Q242 185 240 172 Q200 164 160 164 Q120 164 80 172 Z"
              fill="#EEF6EF"
              stroke="#C8E0CA"
              strokeWidth="1"
            />

            {/* Label lines */}
            <rect x="108" y="196" width="84" height="5" rx="2.5" fill="#B8D8BC" />
            <rect x="116" y="210" width="68" height="4" rx="2" fill="#C8E0CA" />
            <rect x="122" y="222" width="56" height="4" rx="2" fill="#C8E0CA" />
            <rect x="126" y="236" width="48" height="3.5" rx="1.75" fill="#D6EAD8" />
            <rect x="128" y="248" width="44" height="3.5" rx="1.75" fill="#D6EAD8" />
            <line x1="100" y1="268" x2="220" y2="268" stroke="#C8E0CA" strokeWidth="0.75" />
            <rect x="118" y="274" width="64" height="3" rx="1.5" fill="#D8E8DA" />

            {/* Jar bottom rim */}
            <ellipse cx="160" cy="340" rx="92" ry="14" fill="#B8DABC" opacity="0.5" />

            {/* Ground shadow */}
            <ellipse cx="160" cy="380" rx="80" ry="10" fill="#7BBF8A" opacity="0.1" />

            {/* Floating capsules */}
            <ellipse cx="48" cy="230" rx="14" ry="6" fill="#9ECC9E" opacity="0.4" transform="rotate(-18 48 230)" />
            <ellipse cx="272" cy="198" rx="13" ry="5.5" fill="#8FC48F" opacity="0.35" transform="rotate(14 272 198)" />
            <ellipse cx="264" cy="270" rx="11" ry="5" fill="#A8D4A8" opacity="0.3" transform="rotate(-8 264 270)" />
            <ellipse cx="52" cy="295" rx="10" ry="4.5" fill="#9ECC9E" opacity="0.25" transform="rotate(22 52 295)" />
          </svg>
        </div>

        <div className="content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Coming 2026
          </div>

          <h1 className="headline">
            Something
            <br />
            <em>great</em> is
            <br />
            coming
          </h1>

          <p className="subtext">
            We are building a supplement platform focused on clarity, quality,
            and results.
          </p>
        </div>

        <p className="footer-note">© 2026 · Launching soon</p>
      </div>
    </>
  );
}
