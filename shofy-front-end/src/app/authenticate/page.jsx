import Wrapper from "@/layout/wrapper";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import AuthVerifyArea from "@/components/auth-verify/auth-verify-area";

export const metadata = {
  title: "Supplefied - Authentication",
};

export default function AuthenticatePage() {
  return (
    <Wrapper>
      {/* <HeaderTwo style_2={true} /> */}
      {/* <CommonBreadcrumb title="Authenticate" subtitle="Authentication" center={true} /> */}
      <AuthVerifyArea />
      {/* <Footer primary_style={true} /> */}
    </Wrapper>
  );
}
