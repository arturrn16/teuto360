
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { SidebarProvider } from "./components/ui/sidebar";
import { ThemeProvider } from "./components/ThemeProvider";

// Layouts
import { Layout } from "./components/Layout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Comunicados from "./pages/Comunicados";
import CardapioSemana from "./pages/CardapioSemana";
import OfertaCaronas from "./pages/OfertaCaronas";
import Avaliacao from "./pages/Avaliacao";
import MapaRotas from "./pages/MapaRotas";
import Plantao from "./pages/Plantao";
// Admin pages
import Admin from "./pages/Admin";
import GerenciarComunicados from "./pages/GerenciarComunicados";
import GerenciarCardapio from "./pages/GerenciarCardapio";
// Formulários
import AbonoPonto from "./pages/AbonoPonto";
import AdesaoCancelamento from "./pages/AdesaoCancelamento";
import AlteracaoEndereco from "./pages/AlteracaoEndereco";
import MudancaTurno from "./pages/MudancaTurno";
import TransporteRota from "./pages/TransporteRota";
import Transporte12x36 from "./pages/Transporte12x36";
import Refeicao from "./pages/Refeicao";
import MinhasSolicitacoes from "./pages/MinhasSolicitacoes";

import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Functionality routes */}
              <Route path="/comunicados" element={
                <ProtectedRoute>
                  <Layout>
                    <Comunicados />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/cardapio" element={
                <ProtectedRoute>
                  <Layout>
                    <CardapioSemana />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/ofertas-caronas" element={
                <ProtectedRoute>
                  <Layout>
                    <OfertaCaronas />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/avaliacao" element={
                <ProtectedRoute>
                  <Layout>
                    <Avaliacao />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/mapa-rotas" element={
                <ProtectedRoute>
                  <Layout>
                    <MapaRotas />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/plantao" element={
                <ProtectedRoute>
                  <Layout>
                    <Plantao />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Form routes */}
              <Route path="/abono-ponto" element={
                <ProtectedRoute>
                  <Layout>
                    <AbonoPonto />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/adesao-cancelamento" element={
                <ProtectedRoute>
                  <Layout>
                    <AdesaoCancelamento />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/alteracao-endereco" element={
                <ProtectedRoute>
                  <Layout>
                    <AlteracaoEndereco />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/mudanca-turno" element={
                <ProtectedRoute>
                  <Layout>
                    <MudancaTurno />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/transporte-rota" element={
                <ProtectedRoute>
                  <Layout>
                    <TransporteRota />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/transporte-12x36" element={
                <ProtectedRoute>
                  <Layout>
                    <Transporte12x36 />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/refeicao" element={
                <ProtectedRoute allowedTypes={["admin", "refeicao"]}>
                  <Layout>
                    <Refeicao />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/minhas-solicitacoes" element={
                <ProtectedRoute>
                  <Layout>
                    <MinhasSolicitacoes />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedTypes={["admin"]}>
                  <Layout>
                    <Admin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/gerenciar-comunicados" element={
                <ProtectedRoute allowedTypes={["admin"]}>
                  <Layout>
                    <GerenciarComunicados />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/gerenciar-cardapio" element={
                <ProtectedRoute allowedTypes={["admin"]}>
                  <Layout>
                    <GerenciarCardapio />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
