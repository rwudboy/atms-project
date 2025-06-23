import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import DashboardPage from "@/app/dashboard/page";
import OtpPage from "@/app/otp/page";
import Customer from "@/app/customer/page";
import Workgroup from "@/app/workgroup/page";
import Role from "@/app/roles/page";
import UserProfile from "@/app/user-profile/page";
import ProjectInstance from "@/app/project-instance/page";
import ArchivesPage from "@/app/archives/page";
import UnassignTask from "@/app/unassign-task/page";
import AssignTask from "@/app/assign-task/page";

export default function Page({ params }) {
  const pages = {
    register: <RegisterPage />,
    dashboard: <DashboardPage />,
    otp: <OtpPage />,
    customer: <Customer />,
    workgroup: <Workgroup />,
    roles: <Role />,
    "user-profile": < UserProfile/>,
    "project-instance" :<ProjectInstance />,
    archives :<ArchivesPage />,
    "unassign-task" :<UnassignTask />,
    "assign-task" :<AssignTask /> 
  };

  return pages[params?.slug] || <LoginPage />;
}
