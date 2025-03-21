
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

              {/* Routes that need to be implemented */}
              <Route
                path="/transporte-rota"
                element={
                  <ProtectedRoute allowedTypes={["admin", "comum"]}>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Solicitação de Transporte - Rota</h1>
                      <p>Esta página será implementada em breve.</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/transporte-12x36"
                element={
                  <ProtectedRoute allowedTypes={["admin", "comum"]}>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Solicitação de Transporte - 12x36</h1>
                      <p>Esta página será implementada em breve.</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/refeicao"
                element={
                  <ProtectedRoute allowedTypes={["admin", "refeicao"]}>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Solicitação de Refeição</h1>
                      <p>Esta página será implementada em breve.</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/minhas-solicitacoes"
                element={
                  <ProtectedRoute allowedTypes={["comum", "refeicao"]}>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Minhas Solicitações</h1>
                      <p>Esta página será implementada em breve.</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedTypes={["admin"]}>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Administração</h1>
                      <p>Esta página será implementada em breve.</p>
                    </div>
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
