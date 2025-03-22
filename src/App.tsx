
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/context/AuthContext";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Comunicados from "@/pages/Comunicados";
import GerenciarComunicados from "@/pages/GerenciarComunicados";
import AbonoPonto from "@/pages/AbonoPonto";
import AdesaoCancelamento from "@/pages/AdesaoCancelamento";
import AlteracaoEndereco from "@/pages/AlteracaoEndereco";
import MudancaTurno from "@/pages/MudancaTurno";
import MinhasSolicitacoes from "@/pages/MinhasSolicitacoes";
import Admin from "@/pages/Admin";
import Avaliacao from "@/pages/Avaliacao";
import MapaRotas from "@/pages/MapaRotas";
import OfertaCaronas from "@/pages/OfertaCaronas";
import Plantao from "@/pages/Plantao";
import TransporteRota from "@/pages/TransporteRota";
import Transporte12x36 from "@/pages/Transporte12x36";
import Refeicao from "@/pages/Refeicao";
import CardapioSemana from "@/pages/CardapioSemana";
import GerenciarCardapio from "@/pages/GerenciarCardapio";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "refeicao", "colaborador", "comum"]}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/comunicados"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "refeicao", "colaborador", "comum"]}>
              <Layout>
                <Comunicados />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gerenciar-comunicados"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Layout>
                <GerenciarComunicados />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/abono-ponto"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout>
                <AbonoPonto />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/adesao-cancelamento"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout>
                <AdesaoCancelamento />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alteracao-endereco"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout>
                <AlteracaoEndereco />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mudanca-turno"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout>
                <MudancaTurno />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/refeicao"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "refeicao", "colaborador", "comum"]}>
              <Layout>
                <Refeicao />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/minhas-solicitacoes"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "refeicao", "colaborador", "comum"]}>
              <Layout>
                <MinhasSolicitacoes />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Layout>
                <Admin />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/avaliacao"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Layout>
                <Avaliacao />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mapa-rotas"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout>
                <MapaRotas />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/oferta-caronas"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout>
                <OfertaCaronas />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plantao"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout>
                <Plantao />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transporte-rota"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout>
                <TransporteRota />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transporte-12x36"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout>
                <Transporte12x36 />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Refeitório Routes */}
        <Route
          path="/cardapio-semana"
          element={
            <ProtectedRoute allowedTypes={["comum"]}>
              <Layout>
                <CardapioSemana />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gerenciar-cardapio"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Layout>
                <GerenciarCardapio />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
