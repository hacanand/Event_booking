import { redirect } from "next/navigation";
import CustomerDashboardPage from "./customer-dashboard/page";

export default function Home() {
  // redirect("/customer-dashboard");
  return <CustomerDashboardPage />;
}
