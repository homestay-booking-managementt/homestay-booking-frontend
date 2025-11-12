import Login from "@/auth/Login";
import Register from "@/auth/Register";
import Me from "@/pages/Profile/Me";

import PrivateRoute from "@/auth/PrivateRoute";
import BookingDashboardPage from "@/pages/Booking";
import BookingHistoryPage from "@/pages/BookingHistory";
import ComplaintCenterPage from "@/pages/Complaints";
import DashboardHome from "@/pages/DashboardHome/";
import DashboardPage from "@/pages/DashboardPage/";
import {
  HomestayDetailPage,
  HomestayFormPage,
  HomestayListPage,
  MyHomestaysPage,
} from "@/pages/Homestay";
import AdminLayout from "@/pages/Admin/AdminLayout";
import AdminMainDashboard from "@/pages/Admin/AdminMainDashboard";
import AdminUsersPage from "@/pages/Admin/AdminUsersPage";
import AdminHomestayListPage from "@/pages/Admin/AdminHomestayListPage";
import AdminBookingsPage from "@/pages/Admin/AdminBookingsPage";
import AdminRevenuePage from "@/pages/Admin/AdminRevenuePage";
import AdminComplaintsPage from "@/pages/Admin/AdminComplaintsPage";
import AdminSettingsPage from "@/pages/Admin/AdminSettingsPage";
import {
  HostLayout,
  HostDashboardPage,
  HostHomestayListPage,
  HostBookingRequestsPage,
  HostPaymentTransfersPage,
  HostRevenueStatsPage,
  HostSettingsPage,
  HostChatPage,
} from "@/pages/Host";
import PaymentPortalPage from "@/pages/Payment";
import ProfilePage from "@/pages/Profile";
import ReviewHomestayPage from "@/pages/Reviews";
import SupportCenterPage from "@/pages/Support";
import { ErrorPage } from "@/pages/error/ErrorPage";
import { ErrorType } from "@/pages/error/types";
import { useRoutes } from "react-router-dom";
import BookingDetailPage from "@/pages/Booking/BookingDetailPage";

const PublicRoutes = [
  // Public routes (no authentication required)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/403",
    element: <ErrorPage errorType={ErrorType.PermissionDenied} />,
  },
  {
    path: "/401",
    element: <ErrorPage errorType={ErrorType.NotAuthorized} />,
  },
  {
    path: "*",
    element: <ErrorPage errorType={ErrorType.NotFound} />,
  },
];

const PrivateRoutes = [
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "homestays",
            element: <HomestayListPage />,
          },
          {
            path: "homestays/new",
            element: <HomestayFormPage />,
          },
          {
            path: "homestays/mine",
            element: <MyHomestaysPage />,
          },
          {
            path: "homestays/:homestayId",
            element: <HomestayDetailPage />,
          },
          {
            path: "homestays/:homestayId/edit",
            element: <HomestayFormPage />,
          },
          {
            path: "bookings",
            element: <BookingDashboardPage />,
          },
          {
            path: "bookings/history",
            element: <BookingHistoryPage />,
          },
          {
            path: "bookings/:bookingId",
            element: <BookingDetailPage />,
          },
          {
            path: "payments",
            element: <PaymentPortalPage />,
          },
          {
            path: "reviews",
            element: <ReviewHomestayPage />,
          },
          {
            path: "reviews/:bookingId",
            element: <ReviewHomestayPage />,
          },
          {
            path: "complaints",
            element: <ComplaintCenterPage />,
          },
          {
            path: "support",
            element: <SupportCenterPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "me",
            element: <Me />,
          },
        ],
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminMainDashboard />,
          },
          {
            path: "users",
            element: <AdminUsersPage />,
          },
          {
            path: "homestays",
            element: <AdminHomestayListPage />,
          },
          {
            path: "bookings",
            element: <AdminBookingsPage />,
          },
          {
            path: "revenue",
            element: <AdminRevenuePage />,
          },
          {
            path: "complaints",
            element: <AdminComplaintsPage />,
          },
          {
            path: "settings",
            element: <AdminSettingsPage />,
          },
        ],
      },
      {
        path: "/host",
        element: <HostLayout />,
        children: [
          {
            index: true,
            element: <HostDashboardPage />,
          },
          {
            path: "dashboard",
            element: <HostDashboardPage />,
          },
          {
            path: "homestays",
            element: <HostHomestayListPage />,
          },
          {
            path: "booking-requests",
            element: <HostBookingRequestsPage />,
          },
          {
            path: "revenue",
            element: <HostRevenueStatsPage />,
          },
          {
            path: "payments",
            element: <HostPaymentTransfersPage />,
          },
          {
            path: "chat",
            element: <HostChatPage />,
          },
          {
            path: "settings",
            element: <HostSettingsPage />,
          },
        ],
      },
    ],
  },
];

const Router = () => {
  const element = useRoutes([...PublicRoutes, ...PrivateRoutes]);

  return element;
};

export default Router;
