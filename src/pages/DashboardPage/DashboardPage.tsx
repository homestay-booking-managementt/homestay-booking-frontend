import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const DashboardPage = () => {
  return (
    <>
      <Header />
      <div className="container-fluid mt-4">
        <Outlet />
      </div>
    </>
  );
};

export default DashboardPage;
