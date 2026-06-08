import styles from "./coming-soon.module.css";

export default function ComingSoon() {
  return (
    <main className={styles.root}>
      {/* Soft dotted background */}
      <div className={styles.dotGrid} />

      {/* Main centered layout */}
      <section className={styles.centerWrap}>
        {/* Logo above jar */}
        <div className={styles.logoContainer}>
          <img
            src="/assets/img/logo/Supplified_logo.png"
            alt="Supplefied"
            className={styles.logo}
          />
        </div>

        {/* Jar + content block */}
        <div className={styles.jarStage}>
          {/* Background jar */}
          <div className={styles.jarBg}>
            <svg
              viewBox="0 0 320 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.jarSvg}
            >
              {/* Lid top */}
              <ellipse cx="160" cy="72" rx="88" ry="18" fill="#7BBF8A" />

              {/* Lid body */}
              <rect
                x="72"
                y="72"
                width="176"
                height="38"
                rx="6"
                fill="#8FCC9E"
              />

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
              <ellipse
                cx="48"
                cy="230"
                rx="14"
                ry="6"
                fill="#9ECC9E"
                opacity="0.4"
                transform="rotate(-18 48 230)"
              />
              <ellipse
                cx="272"
                cy="198"
                rx="13"
                ry="5.5"
                fill="#8FC48F"
                opacity="0.35"
                transform="rotate(14 272 198)"
              />
              <ellipse
                cx="264"
                cy="270"
                rx="11"
                ry="5"
                fill="#A8D4A8"
                opacity="0.3"
                transform="rotate(-8 264 270)"
              />
              <ellipse
                cx="52"
                cy="295"
                rx="10"
                ry="4.5"
                fill="#9ECC9E"
                opacity="0.25"
                transform="rotate(22 52 295)"
              />
            </svg>
          </div>

          {/* Text over jar */}
          <div className={styles.content}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Coming 2026
            </div>

            <h1 className={styles.headline}>
              Something
              <br />
              <em>great</em> is
              <br />
              coming
            </h1>

            <p className={styles.subtext}>
              We are building a supplement platform focused on clarity, quality,
              and results.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footerNote}>
        <p>© 2026 · Launching soon</p>
        <a href="mailto:Supplefied@gmail.com">
         Supplefied@gmail.com
        </a>
      </footer>
    </main>
  );
}