import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../authentication/LoginPage';
import AdminLayout from '../layouts/AdminLayout';
import CreateAccountPage from '../AdminPages/CreateAccountPage';
import AccountListPage from '../AdminPages/AccountListPage';
import Maker from '../layouts/Maker';
import MakerHomePage from '../MakerPages/MakerHomePage';
import PatternRecordsPage from '../MakerPages/PatternRecordsPage';
import DesignerLayout from '../layouts/DesignerLayout';
import ApprovalPage from '../DesignerPages/ApprovalPage';
import ReportPage from '../DesignerPages/ReportPage';
import Dashboard from '../DesignerPages/DashboardPage';
import DataPatternPage from '../DesignerPages/DataPatternsPage';
//const {user} = useStateContext();
const getUser = () => {
       // const {isAuthenticated} = useStateContext();

        return {
            isAuthenticated:  sessionStorage.getItem("token") ,
            role: sessionStorage.getItem("user-role") 
        }
};

const RoleRedirect = () => {
    const user = getUser();
    if (!user.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'Admin') {
        return <Navigate to="/admin/create" replace />;
    } else if (user.role === 'Senior Fashion Designer') {
        return <Navigate to="/designer/requests" replace />;
    } else if (user.role === 'Pattern Maker') {
        return <Navigate to="/maker/home" replace />;
    }

    return <strong>Unauthorized</strong>;
};

const ProtectedRoute = ({ allowedRoles }) => {
    const user = getUser();

    if (!user.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <RoleRedirect />
    },
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [
            {
                path: "/admin",
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Navigate to="/admin/create" replace /> },
                    { path: "create", element: <CreateAccountPage /> },
                    { path: "accounts", element: <AccountListPage /> }
                ]
            }
        ]
    },
    {
        path: "/designer",
        element: <ProtectedRoute allowedRoles={['Senior Fashion Designer']} />,
        children: [
            {
                path: "/designer",
                element: <DesignerLayout />,
                children: [
                    { index: true, element: <Navigate to="/designer/requests" replace /> },
                    { path: "requests", element: <ApprovalPage /> },
                    { path: "records-data", element: <DataPatternPage /> },
                    { path: "reports", element: <ReportPage /> },
                    { path: "dashboard", element: <Dashboard /> }
                ]
            }
        ]
    },
    {
        path: "/maker",
        element: <ProtectedRoute allowedRoles={['Pattern Maker']} />,
        children: [
            {
                path: "/maker",
                element: <Maker />,
                children: [
                    { index: true, element: <Navigate to="/maker/home" replace /> },
                    { path: "home", element: <MakerHomePage /> },
                    { path: "records", element: <PatternRecordsPage /> }
                ]
            }
        ]
    },
    {
        path: "/login",
        element: getUser().isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
    },
    {
        path: "*",
        element: <strong>404 Not Found</strong>
    }
]);

export default router;
