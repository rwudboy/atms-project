import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import DashboardPage from "@/app/dashboard/page";
import OtpPage from "@/app/otp/page";
import Customer from "@/app/customer/page";
import Workgroup from "@/app/workgroup/page";
import Role from "@/app/roles/page";
import UserProfile from "@/app/userProfile/page";
import ProjectInstance from "@/app/projectInstance/page";
import ArchivesPage from "@/app/archives/page";
// import UnassignTask from "@/app/unassignTask/page";
import AssignTask from "@/app/task/page";
import UserRole from "@/app/task/page";
import Overdue from "@/app/overdue/page";
import ForgotPassword from "@/app/forgotPassword/page";

export default function Page({ params }) {
  const pages = {
    register: <RegisterPage />,
    dashboard: <DashboardPage />,
    otp: <OtpPage />,
    customer: <Customer />,
    workgroup: <Workgroup />,
    roles: <Role />,
    userProfile: < UserProfile/>,
    projectInstances :<ProjectInstance />,
    archives :<ArchivesPage />,
    // unassignTask:<UnassignTask />,
    task :<AssignTask />,
    userRole :<UserRole />,
    Overdue :<Overdue />,
    ForgotPassword :<ForgotPassword />
  };

  return pages[params?.slug] || <LoginPage />;
}
