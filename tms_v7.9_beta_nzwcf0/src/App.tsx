import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Sidebar } from "./components/Sidebar";
import { InactiveUser } from "./components/InactiveUser";
import { ComingSoon } from "./components/ComingSoon";
import { UsersPage } from "./components/UsersPage";
import { SettingsPage } from "./components/SettingsPage";
import { RecordsDashboard } from "./components/RecordsDashboard";
import { LoadDashboard } from "./components/LoadDashboard";
import { TodoPage } from "./components/TodoPage";
import { InvoicePage } from "./components/InvoicePage";
import Dashboard from "./components/Dashboard";
import { useQuery, useMutation } from "convex/react";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Loading component for better UX
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-[#FFD700] text-xl animate-pulse">Loading...</div>
    </div>
  );
}

// Main layout for authenticated users
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const profile = useQuery(api.users.getProfile);

  if (profile === undefined) {
    return <LoadingScreen />;
  }

  if (profile === null || profile?.status === "inactive") {
    return (
      <div className="flex-1 bg-black">
        <InactiveUser />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-black">
        {children}
      </main>
    </div>
  );
}

// Route configuration
const routes = [
  { path: "/", element: <Dashboard /> },
  { path: "/loads", element: <LoadDashboard /> },
  { path: "/records", element: <RecordsDashboard /> },
  { path: "/users", element: <UsersPage /> },
  { path: "/todo", element: <TodoPage /> },
  { path: "/invoices", element: <InvoicePage /> },
  { path: "/settings", element: <SettingsPage /> },
  { path: "/accounting", element: <ComingSoon /> },
  { path: "/reports", element: <ComingSoon /> },
  { path: "/support", element: <ComingSoon /> },
];

// Unauthenticated view
function UnauthenticatedView() {
  return (
    <div className="w-full max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Evertus Logistics</h1>
      <SignInForm />
    </div>
  );
}

export default function App() {
  const profile = useQuery(api.users.getProfile);
  const initializeFirst = useMutation(api.users.initializeFirstUser);

  useEffect(() => {
    if (profile === null) {
      initializeFirst().catch(console.error);
    }
  }, [profile, initializeFirst]);

  return (
    <Router>
      <div className="min-h-screen">
        <Authenticated>
          <AuthenticatedLayout>
            <Routes>
              {routes.map(({ path, element }) => (
                <Route 
                  key={path} 
                  path={path} 
                  element={element}
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthenticatedLayout>
        </Authenticated>
        <Unauthenticated>
          <UnauthenticatedView />
        </Unauthenticated>
        <Toaster />
      </div>
    </Router>
  );
}
