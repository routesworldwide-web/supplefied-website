import Image from "next/image";

import partnerOne from "@assets/img/partners/partner-1.png";
import partnerTwo from "@assets/img/partners/partner-2.png";
import partnerThree from "@assets/img/partners/partner-3.png";
import partnerFour from "@assets/img/partners/partner-4.png";
// import partnerFive from "@assets/img/partners/partner-5.png";
// import partnerSix from "@assets/img/partners/partner-6.png";
// import partnerSeven from "@assets/img/partners/partner-7.png";
// import partnerEight from "@assets/img/partners/partner-8.png";

const partners = [
  { src: partnerOne,   alt: "MuscleMeds" },
  { src: partnerTwo,   alt: "MHP" },
  { src: partnerThree, alt: "Surpsupps" },
  { src: partnerFour,  alt: "Nuera" },
//   { src: partnerFive,  alt: "Klean Athlete" },
//   { src: partnerSix,   alt: "Thorne" },
//   { src: partnerSeven, alt: "MHP" },
//   { src: partnerEight, alt: "Pure Protein" },
];

const PartnersSection = () => {
  return (
    <section className="tp-about-page-partners pb-100">
      <div className="container">
        <p className="tp-about-page-partners-label">Trusted by leading brands</p>
      </div>
      <div className="tp-about-page-partners-overflow">
        <div className="tp-about-page-partners-track">
          {partners.map((partner) => (
            <div className="tp-about-page-partners-logo" key={partner.alt}>
              <Image
                src={partner.src}
                alt={partner.alt}
                height={72}
                style={{ width: "auto", height: "72px", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
