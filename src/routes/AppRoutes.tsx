import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PageLoader } from '@/components/ui/loader-spinner';
import { ProtectedRoute } from '@/context/AuthContext';

// Lazy load all the pages
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin pages
const Admin = lazy(() => import('@/pages/Admin'));
const Relatorios = lazy(() => import('@/pages/Relatorios'));
const GerenciarComunicados = lazy(() => import('@/pages/GerenciarComunicados'));
const GerenciarCardapio = lazy(() => import('@/pages/GerenciarCardapio'));
const GerenciarCartoes = lazy(() => import('@/pages/GerenciarCartoes'));
const GerenciarUsuarios = lazy(() => import('@/pages/GerenciarUsuarios'));

// Regular pages
const TransporteRota = lazy(() => import('@/pages/TransporteRota'));
const Transporte12x36 = lazy(() => import('@/pages/Transporte12x36'));
const Refeicao = lazy(() => import('@/pages/Refeicao'));
const Comunicados = lazy(() => import('@/pages/Comunicados'));
const MinhasSolicitacoes = lazy(() => import('@/pages/MinhasSolicitacoes'));
const MapaRotas = lazy(() => import('@/pages/MapaRotas'));
const AdesaoCancelamento = lazy(() => import('@/pages/AdesaoCancelamento'));
const MudancaTurno = lazy(() => import('@/pages/MudancaTurno'));
const AlteracaoEndereco = lazy(() => import('@/pages/AlteracaoEndereco'));
const AbonoPonto = lazy(() => import('@/pages/AbonoPonto'));
const Avaliacao = lazy(() => import('@/pages/Avaliacao'));
const Plantao = lazy(() => import('@/pages/Plantao'));
const OfertaCaronas = lazy(() => import('@/pages/OfertaCaronas'));
const ConsultaCartao = lazy(() => import('@/pages/ConsultaCartao'));
const CardapioSemana = lazy(() => import('@/pages/CardapioSemana'));

export const AppRoutes = () => {
  const location = useLocation();

  // If the route is /, redirect to /login
  if (location.pathname === '/') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <Admin />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/relatorios" element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <Relatorios />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-comunicados" element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <GerenciarComunicados />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-cardapio" element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <GerenciarCardapio />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-cartoes" element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <GerenciarCartoes />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-usuarios" element={
          <ProtectedRoute allowedTypes={["admin"] as const}>
            <Layout>
              <GerenciarUsuarios />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Other routes */}
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

        <Route
          path="/relatorios"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <Relatorios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consulta-cartao"
          element={
            <ProtectedRoute allowedTypes={["colaborador", "comum"]}>
              <ConsultaCartao />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gerenciar-cartoes"
          element={
            <ProtectedRoute allowedTypes={["admin"]}>
              <GerenciarCartoes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
