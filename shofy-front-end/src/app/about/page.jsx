import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import AboutArea from "@/components/about/about-area";

export const metadata = {
  title: "About Us | Supplefied",
  description: "Learn about Supplefied, our values, and our approach to trusted supplement and wellness shopping.",
};

export default function AboutPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <AboutArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
