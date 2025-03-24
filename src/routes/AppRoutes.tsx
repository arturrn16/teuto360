import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/context/AuthContext";

// Import pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import TransporteRota from "@/pages/TransporteRota";
import Transporte12x36 from "@/pages/Transporte12x36";
import Refeicao from "@/pages/Refeicao";
import MinhasSolicitacoes from "@/pages/MinhasSolicitacoes";
import Admin from "@/pages/Admin";
import Comunicados from "@/pages/Comunicados";
import GerenciarComunicados from "@/pages/GerenciarComunicados";
import Relatorios from "@/pages/Relatorios";
import CardapioSemana from "@/pages/CardapioSemana";
import GerenciarCardapio from "@/pages/GerenciarCardapio";
import AdesaoCancelamento from "@/pages/AdesaoCancelamento";
import MudancaTurno from "@/pages/MudancaTurno";
import AlteracaoEndereco from "@/pages/AlteracaoEndereco";
import AbonoPonto from "@/pages/AbonoPonto";
import Avaliacao from "@/pages/Avaliacao";
import Plantao from "@/pages/Plantao";
import MapaRotas from "@/pages/MapaRotas";
import OfertaCaronas from "@/pages/OfertaCaronas";

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Root route */}
        <Route index element={<Index />} />
        
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
            <ProtectedRoute allowedTypes={["admin", "selecao", "refeicao"]}>
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
        
        {/* Announcements routes */}
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
        
        {/* Cafeteria menu routes - updated to exclude 'refeicao' user type */}
        <Route
          path="/cardapio-semana"
          element={
            <ProtectedRoute allowedTypes={["selecao", "colaborador", "comum"]}>
              <CardapioSemana />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gerenciar-cardapio"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <GerenciarCardapio />
            </ProtectedRoute>
          }
        />
        
        {/* Collaborator routes */}
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
        
        <Route
          path="/oferta-caronas"
          element={
            <ProtectedRoute allowedTypes={["colaborador", "comum"]}>
              <OfertaCaronas />
            </ProtectedRoute>
          }
        />

        {/* Reports route */}
        <Route
          path="/relatorios"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Relatorios />
            </ProtectedRoute>
          }
        />

        {/* Fallback for routes inside Layout */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
