
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense, lazy } from "react";
import { PageLoader } from "./components/ui/loader-spinner";

// Import pages using lazy loading with clean imports
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AppRoutes = lazy(() => import("./routes/AppRoutes"));

// App Assets
export const TEUTO_LOGO = "/lovable-uploads/34cd00a7-eda2-4ab2-b582-8951d814b31c.png";

// Create a client with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Only retry once by default
      networkMode: 'always', // Changed from online to always to reduce latency
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes outside Layout */}
              <Route path="/login" element={<Login />} />
              
              {/* App routes with Layout */}
              <Route path="/*" element={<AppRoutes />} />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
