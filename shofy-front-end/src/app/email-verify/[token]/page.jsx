import EmailVerifyArea from "@/components/email-verify/email-verify-area";

export const metadata = {
  title: "Supplefied - Verify Your Email",
};

export default function EmailVerifyPage({ params }) {
  return (
    <>
      <EmailVerifyArea token={params.token} />
    </>
  );
}
