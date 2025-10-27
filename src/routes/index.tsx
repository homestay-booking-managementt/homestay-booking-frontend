import Login from "@/auth/Login";
import PrivateRoute from "@/auth/PrivateRoute";
import DashboardHome from "@/pages/DashboardHome/";
import DashboardPage from "@/pages/DashboardPage/";
import { ErrorPage } from "@/pages/error/ErrorPage";
import { ErrorType } from "@/pages/error/types";
import HomePage from "@/pages/HomePage";
import { useRoutes } from "react-router-dom";

const PublicRoutes = [
    // Public routes (no authentication required)
    {
        path: "/login",
        element: <Login />,
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
            // Home page
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/dashboard",
                element: <DashboardPage />,
                children: [
                    {
                        index: true,
                        element: <DashboardHome />,
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
