import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import LegalPage from "@/components/legal/legal-page";
import { privacyPolicySections } from "@/data/legal-pages";

export const metadata = {
  title: "Privacy Policy | Supplefied",
  description: "Learn how Supplefied collects, uses, stores, and protects customer information.",
};

export default function PrivacyPolicyPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <LegalPage
        eyebrow="Your privacy matters"
        title="Privacy Policy"
        introduction="This policy explains what information we collect, why we use it, and the choices available to you when shopping with Supplefied."
        sections={privacyPolicySections}
      />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
