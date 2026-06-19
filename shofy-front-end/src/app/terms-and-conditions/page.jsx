import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import LegalPage from "@/components/legal/legal-page";
import { termsSections } from "@/data/legal-pages";

export const metadata = {
  title: "Terms and Conditions | Supplefied",
  description: "Review the terms that apply when using Supplefied and purchasing products from our store.",
};

export default function TermsAndConditionsPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <LegalPage
        eyebrow="Clear terms, confident shopping"
        title="Terms and Conditions"
        introduction="These terms explain the rules for using our website, placing orders, and purchasing health and wellness products from Supplefied."
        sections={termsSections}
      />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
