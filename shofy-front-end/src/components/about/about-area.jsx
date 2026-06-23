import Image from "next/image";
import Link from "next/link";
import Partners from "@/components/about/partners";
import CtaArea from "@/components/cta/cta-area";
import aboutImageOne from "@assets/img/about/about-1.png";
import aboutImageTwo from "@assets/img/about/about-2.png";

const values = [
  {
    number: "01",
    title: "Quality first",
    text: "We focus on trusted products, clear information, and careful sourcing so customers can shop with greater confidence.",
  },
  {
    number: "02",
    title: "Honest guidance",
    text: "We keep product information practical and straightforward, without treating general wellness content as medical advice.",
  },
  {
    number: "03",
    title: "Customer care",
    text: "From product discovery to delivery support, we aim to make every step responsive, respectful, and easy to understand.",
  },
];




const AboutArea = () => {
  return (
    <main className="tp-about-page">
      <section className="tp-about-page-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="tp-about-page-hero-content">
                <span>About Supplefied</span>
                <h1>Wellness shopping made clearer and more dependable.</h1>
                <p>
                  Supplefied brings premium supplements and nutritional products
                  together in one thoughtful shopping experience—built around
                  quality, useful information, and genuine customer care.
                </p>
                <div className="tp-about-page-actions">
                  <Link href="/shop" className="tp-btn">
                    Explore Products
                  </Link>
                  <Link href="/contact" className="tp-about-page-link">
                    Talk to our team <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="tp-about-page-hero-visual">
                <div className="tp-about-page-hero-image">
                  <Image
                    src={aboutImageOne}
                    alt="Supplefied wellness products"
                    fill
                    priority
                    sizes="(max-width: 991px) 100vw, 50vw"
                  />
                </div>
                <div className="tp-about-page-hero-note">
                  <strong>Built for better choices</strong>
                  <span>Quality products. Clear information. Helpful support.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tp-about-page-story pt-100 pb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="tp-about-page-story-images">
                <div className="tp-about-page-story-image-main">
                  <Image
                    src={aboutImageTwo}
                    alt="Our approach to wellness and nutrition"
                    fill
                    sizes="(max-width: 991px) 100vw, 50vw"
                  />
                </div>
                <div className="tp-about-page-story-stat">
                  <strong>One trusted destination</strong>
                  <span>for performance, nutrition, and everyday wellness</span>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="tp-about-page-story-content">
                <span className="tp-about-page-eyebrow">Our story</span>
                <h2>Created to make the supplement aisle feel less complicated.</h2>
                <p>
                  Choosing wellness products can feel crowded with technical
                  claims, unfamiliar ingredients, and too many options.
                  Supplefied was created to offer a cleaner path: a considered
                  product range, accessible information, and a store that puts
                  long-term trust ahead of short-term hype.
                </p>
                <p>
                  We serve customers looking for sports nutrition, active
                  lifestyle support, and everyday wellness essentials. Our role
                  is to make products easier to discover and compare while
                  encouraging responsible use and professional healthcare advice
                  whenever it is needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tp-about-page-values pb-100">
        <div className="container">
          <div className="tp-about-page-section-head">
            <span className="tp-about-page-eyebrow">What guides us</span>
            <h2>Simple principles behind every customer experience.</h2>
          </div>
          <div className="row">
            {values.map((value) => (
              <div className="col-lg-4 col-md-6" key={value.number}>
                <article className="tp-about-page-value-card">
                  <span>{value.number}</span>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Partners />

      <CtaArea />
    </main>
  );
};

export default AboutArea;
