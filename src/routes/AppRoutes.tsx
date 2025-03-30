import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/loader-spinner";

// Lazy load pages
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Perfil = lazy(() => import("@/pages/Perfil")); 

export const AppRoutes = () => {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute allowedTypes={["comum"] as const}><Perfil /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </Layout>
  );
};
