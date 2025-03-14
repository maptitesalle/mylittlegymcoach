import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Wizard from "@/pages/Wizard";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import "@/App.css";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const DashboardRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { userData } = useUserData();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const hasCompletedWizard = userData && Object.keys(userData).length > 0;
  
  if (!hasCompletedWizard) {
    return <Navigate to="/wizard" replace />;
  }
  
  return <>{children}</>;
};

const HomeRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { userData } = useUserData();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  if (user) {
    const hasCompletedWizard = userData && Object.keys(userData).length > 0;
    if (hasCompletedWizard) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/wizard" replace />;
    }
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomeRoute>
                  <Home />
                </HomeRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/wizard" 
              element={
                <ProtectedRoute>
                  <Wizard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard" 
              element={
                <DashboardRoute>
                  <Dashboard />
                </DashboardRoute>
              }
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
