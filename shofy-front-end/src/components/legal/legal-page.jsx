import Link from "next/link";

const LegalPage = ({ eyebrow, title, introduction, sections }) => {
  return (
    <main className="tp-legal-area">
      <section className="tp-legal-hero">
        <div className="container">
          <div className="tp-legal-hero-content">
            <span>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{introduction}</p>
            <div className="tp-legal-updated">Effective date: June 18, 2026</div>
          </div>
        </div>
      </section>

      <section className="tp-legal-content-area pt-70 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-lg-12">
              <article className="tp-legal-card">
                {sections.map((section, index) => (
                  <section className="tp-legal-section" key={section.title}>
                    <div className="tp-legal-section-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="tp-legal-section-content">
                      <h2>{section.title}</h2>
                      {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {section.bullets && (
                        <ul>
                          {section.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </section>
                ))}

                <section className="tp-legal-contact">
                  <div>
                    <span>Questions about this document?</span>
                    <h2>We are here to help.</h2>
                    <p>
                      Email us at{" "}
                      <a href="mailto:supplefied@gmail.com">supplefied@gmail.com</a>
                      {" "}or contact our customer-support team.
                    </p>
                  </div>
                  <Link href="/contact" className="tp-btn">
                    Contact Us
                  </Link>
                </section>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LegalPage;
