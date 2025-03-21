
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/context/AuthContext";

// Import layout
import { Layout } from "@/components/Layout";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import TransporteRota from "./pages/TransporteRota";
import Transporte12x36 from "./pages/Transporte12x36";
import Refeicao from "./pages/Refeicao";
import MinhasSolicitacoes from "./pages/MinhasSolicitacoes";
import Admin from "./pages/Admin";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route index element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/transporte-rota"
                element={
                  <ProtectedRoute allowedTypes={["admin", "comum"]}>
                    <TransporteRota />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/transporte-12x36"
                element={
                  <ProtectedRoute allowedTypes={["admin", "comum"]}>
                    <Transporte12x36 />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/refeicao"
                element={
                  <ProtectedRoute allowedTypes={["admin", "refeicao"]}>
                    <Refeicao />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/minhas-solicitacoes"
                element={
                  <ProtectedRoute allowedTypes={["comum", "refeicao"]}>
                    <MinhasSolicitacoes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedTypes={["admin"]}>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
