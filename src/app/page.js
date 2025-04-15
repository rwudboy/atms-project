import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import DashboardPage from "@/app/dashboard/page";
import OtpPage from "@/app/otp/page";

export default function Page({ params }) {
  const pages = {
    register: <RegisterPage />,
    dashboard: <DashboardPage />,
    otp: <OtpPage />
  };

  return pages[params?.slug] || <LoginPage />;
}
