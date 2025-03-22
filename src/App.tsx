
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/Layout";  // Using named import
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
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        <Route
          path="/comunicados"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "refeicao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Comunicados />} />
        </Route>

        <Route
          path="/gerenciar-comunicados"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GerenciarComunicados />} />
        </Route>

        <Route
          path="/abono-ponto"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AbonoPonto />} />
        </Route>

        <Route
          path="/adesao-cancelamento"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdesaoCancelamento />} />
        </Route>

        <Route
          path="/alteracao-endereco"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AlteracaoEndereco />} />
        </Route>

        <Route
          path="/mudanca-turno"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MudancaTurno />} />
        </Route>

        <Route
          path="/refeicao"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "refeicao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Refeicao />} />
        </Route>

        <Route
          path="/minhas-solicitacoes"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "refeicao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MinhasSolicitacoes />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Admin />} />
        </Route>

        <Route
          path="/avaliacao"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Avaliacao />} />
        </Route>

        <Route
          path="/mapa-rotas"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MapaRotas />} />
        </Route>

        <Route
          path="/oferta-caronas"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OfertaCaronas />} />
        </Route>

        <Route
          path="/plantao"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Plantao />} />
        </Route>

        <Route
          path="/transporte-rota"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TransporteRota />} />
        </Route>

        <Route
          path="/transporte-12x36"
          element={
            <ProtectedRoute allowedTypes={["admin", "selecao", "colaborador", "comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Transporte12x36 />} />
        </Route>
        
        {/* Refeitório Routes */}
        <Route
          path="/cardapio-semana"
          element={
            <ProtectedRoute allowedTypes={["comum"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CardapioSemana />} />
        </Route>

        <Route
          path="/gerenciar-cardapio"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GerenciarCardapio />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
