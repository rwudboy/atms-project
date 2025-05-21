import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import DashboardPage from "@/app/dashboard/page";
import OtpPage from "@/app/otp/page";
import Customer from "@/app/customer/page";
import Workgroup from "@/app/workgroup/page";
import Role from "@/app/roles/page";
import ProjectInstance from "@/app/project-instance/page";

export default function Page({ params }) {
  const pages = {
    register: <RegisterPage />,
    dashboard: <DashboardPage />,
    otp: <OtpPage />,
    customer: <Customer />,
    workgroup: <Workgroup />,
    roles: <Role />,
    "project-instance" :<ProjectInstance /> 
  };

  return pages[params?.slug] || <LoginPage />;
}
