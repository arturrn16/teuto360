import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/context/AuthContext";

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
import Comunicados from "./pages/Comunicados";
import GerenciarComunicados from "./pages/GerenciarComunicados";
import OfertaCaronas from "./pages/OfertaCaronas";

// Import new pages for collaborators
import AdesaoCancelamento from "./pages/AdesaoCancelamento";
import MudancaTurno from "./pages/MudancaTurno";
import AlteracaoEndereco from "./pages/AlteracaoEndereco";
import AbonoPonto from "./pages/AbonoPonto";
import Avaliacao from "./pages/Avaliacao";
import Plantao from "./pages/Plantao";
import MapaRotas from "./pages/MapaRotas";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
              <ProtectedRoute allowedTypes={["admin", "selecao", "comum"]}>
                <TransporteRota />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transporte-12x36"
            element={
              <ProtectedRoute allowedTypes={["admin", "selecao"]}>
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
              <ProtectedRoute allowedTypes={["selecao", "refeicao", "colaborador", "comum"]}>
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
          
          {/* New routes for announcements */}
          <Route
            path="/comunicados"
            element={
              <ProtectedRoute allowedTypes={["selecao", "refeicao", "colaborador", "comum"]}>
                <Comunicados />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gerenciar-comunicados"
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <GerenciarComunicados />
              </ProtectedRoute>
            }
          />
          
          {/* Routes for collaborators and comum users */}
          <Route
            path="/adesao-cancelamento"
            element={
              <ProtectedRoute allowedTypes={["colaborador", "comum"]}>
                <AdesaoCancelamento />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/mudanca-turno"
            element={
              <ProtectedRoute allowedTypes={["colaborador", "comum"]}>
                <MudancaTurno />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/alteracao-endereco"
            element={
              <ProtectedRoute allowedTypes={["colaborador", "comum"]}>
                <AlteracaoEndereco />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/abono-ponto"
            element={
              <ProtectedRoute allowedTypes={["colaborador", "comum"]}>
                <AbonoPonto />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/avaliacao"
            element={
              <ProtectedRoute allowedTypes={["colaborador", "comum"]}>
                <Avaliacao />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/plantao"
            element={
              <ProtectedRoute allowedTypes={["colaborador", "comum"]}>
                <Plantao />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/mapa-rotas"
            element={
              <ProtectedRoute allowedTypes={["colaborador", "comum"]}>
                <MapaRotas />
              </ProtectedRoute>
            }
          />
          
          {/* New route for "Oferta de Caronas" */}
          <Route
            path="/oferta-caronas"
            element={
              <ProtectedRoute allowedTypes={["comum"]}>
                <OfertaCaronas />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
