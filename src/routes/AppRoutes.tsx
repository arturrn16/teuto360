
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, ProtectedRoute } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/loader-spinner";
import { Layout } from "@/components/Layout";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

// Lazy loading for better performance
const Comunicados = lazy(() => import("@/pages/Comunicados"));
const CardapioSemana = lazy(() => import("@/pages/CardapioSemana"));
const MapaRotas = lazy(() => import("@/pages/MapaRotas"));
const TransporteRota = lazy(() => import("@/pages/TransporteRota"));
const Transporte12x36 = lazy(() => import("@/pages/Transporte12x36"));
const Refeicao = lazy(() => import("@/pages/Refeicao"));
const Avaliacao = lazy(() => import("@/pages/Avaliacao"));
const OfertaCaronas = lazy(() => import("@/pages/OfertaCaronas"));
const GerenciarComunicados = lazy(() => import("@/pages/GerenciarComunicados"));
const GerenciarCardapio = lazy(() => import("@/pages/GerenciarCardapio"));
const GerenciarCartoes = lazy(() => import("@/pages/GerenciarCartoes"));
const ConsultaCartao = lazy(() => import("@/pages/ConsultaCartao"));
const AbonoPonto = lazy(() => import("@/pages/AbonoPonto"));
const AdesaoCancelamento = lazy(() => import("@/pages/AdesaoCancelamento"));
const AlteracaoEndereco = lazy(() => import("@/pages/AlteracaoEndereco"));
const MudancaTurno = lazy(() => import("@/pages/MudancaTurno"));
const MinhasSolicitacoes = lazy(() => import("@/pages/MinhasSolicitacoes"));
const Admin = lazy(() => import("@/pages/Admin"));
const GerenciarUsuarios = lazy(() => import("@/pages/GerenciarUsuarios"));

const LoadingPage = () => <PageLoader />;

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/comunicados"
        element={
          <ProtectedRoute>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <Comunicados />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cardapio-semana"
        element={
          <ProtectedRoute>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <CardapioSemana />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mapa-rotas"
        element={
          <ProtectedRoute>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <MapaRotas />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transporte-rota"
        element={
          <ProtectedRoute allowedTypes={["selecao", "admin"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <TransporteRota />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transporte-12x36"
        element={
          <ProtectedRoute allowedTypes={["selecao", "admin"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <Transporte12x36 />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/refeicao"
        element={
          <ProtectedRoute allowedTypes={["admin", "refeicao"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <Refeicao />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/avaliacao"
        element={
          <ProtectedRoute allowedTypes={["admin", "refeicao"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <Avaliacao />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/oferta-caronas"
        element={
          <ProtectedRoute>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <OfertaCaronas />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gerenciar-comunicados"
        element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <GerenciarComunicados />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gerenciar-cardapio"
        element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <GerenciarCardapio />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gerenciar-cartoes"
        element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <GerenciarCartoes />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/consulta-cartao"
        element={
          <ProtectedRoute>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <ConsultaCartao />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/abono-ponto"
        element={
          <ProtectedRoute allowedTypes={["selecao", "admin", "colaborador"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <AbonoPonto />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adesao-cancelamento"
        element={
          <ProtectedRoute allowedTypes={["selecao", "admin", "colaborador"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <AdesaoCancelamento />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/alteracao-endereco"
        element={
          <ProtectedRoute allowedTypes={["selecao", "admin", "colaborador"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <AlteracaoEndereco />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mudanca-turno"
        element={
          <ProtectedRoute allowedTypes={["selecao", "admin", "colaborador"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <MudancaTurno />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/minhas-solicitacoes"
        element={
          <ProtectedRoute>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <MinhasSolicitacoes />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <Admin />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/gerenciar-usuarios"
        element={
          <ProtectedRoute allowedTypes={["admin"] as const} requiredUser="artur.neto">
            <Layout>
              <Suspense fallback={<LoadingPage />}>
                <GerenciarUsuarios />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Redirect to Dashboard if user is authenticated but hits unknown route */}
      <Route
        path="*"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <NotFound />}
      />
    </Routes>
  );
};

export default AppRoutes;
