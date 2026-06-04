import ForgotPasswordArea from "@/components/fortgot-password/forgot-password-area";

export const metadata = {
  title: "Supplefied - Reset Your Password",
};

export default function ForgetPasswordPage({ params }) {
  return (
    <>
      <ForgotPasswordArea token={params.token} />
    </>
  );
}
