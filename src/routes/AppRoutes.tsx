
import { lazy, Suspense, memo } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PageLoader } from '@/components/ui/loader-spinner';
import { ProtectedRoute } from '@/context/AuthContext';

// Import pages with lower precedence to optimize loading
// Using a consistent import pattern for all lazy-loaded components
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin pages
const Admin = lazy(() => import('@/pages/Admin'));
const Relatorios = lazy(() => import('@/pages/Relatorios'));
const RelatorioRefeicao = lazy(() => import('@/pages/RelatorioRefeicao'));
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

// Create a protected route wrapper to simplify route definitions
const ProtectedPage = memo(({ 
  component: Component, 
  allowedTypes 
}: { 
  component: React.ComponentType,
  allowedTypes?: readonly ("admin" | "selecao" | "gestor" | "colaborador" | "comum")[]
}) => {
  return (
    <ProtectedRoute allowedTypes={allowedTypes}>
      <Layout>
        <Component />
      </Layout>
    </ProtectedRoute>
  );
});

ProtectedPage.displayName = 'ProtectedPage';

// Define route groups to improve organization and reduce duplication
const routeGroups = {
  admin: [
    { path: '/admin', component: Admin },
    { path: '/relatorios', component: Relatorios },
    { path: '/relatorio-refeicao', component: RelatorioRefeicao },
    { path: '/gerenciar-comunicados', component: GerenciarComunicados },
    { path: '/gerenciar-cardapio', component: GerenciarCardapio },
    { path: '/gerenciar-cartoes', component: GerenciarCartoes },
    { path: '/gerenciar-usuarios', component: GerenciarUsuarios },
  ],
  
  adminSelecaoComum: [
    { path: '/transporte-rota', component: TransporteRota },
  ],
  
  adminSelecaoGestor: [
    { path: '/transporte-12x36', component: Transporte12x36 },
  ],
  
  adminGestor: [
    { path: '/refeicao', component: Refeicao },
  ],
  
  selecaoGestorColaboradorComum: [
    { path: '/minhas-solicitacoes', component: MinhasSolicitacoes },
    { path: '/comunicados', component: Comunicados },
  ],
  
  // Updated to remove selecao from cardapio-semana access
  comum: [
    { path: '/cardapio-semana', component: CardapioSemana },
  ],
  
  gestorComum: [
    { path: '/adesao-cancelamento', component: AdesaoCancelamento },
    { path: '/alteracao-endereco', component: AlteracaoEndereco },
    { path: '/abono-ponto', component: AbonoPonto },
    { path: '/avaliacao', component: Avaliacao },
    { path: '/plantao', component: Plantao },
    { path: '/mapa-rotas', component: MapaRotas },
    { path: '/oferta-caronas', component: OfertaCaronas },
    { path: '/consulta-cartao', component: ConsultaCartao },
  ],
  
  gestorOnly: [
    { path: '/mudanca-turno', component: MudancaTurno },
  ],
};

// Create a memoized AppRoutes component
const AppRoutesComponent = memo(() => {
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
        
        {/* Dashboard - accessible by all authenticated users */}
        <Route
          path="/dashboard"
          element={<ProtectedPage component={Dashboard} />}
        />
        
        {/* Admin Routes */}
        {routeGroups.admin.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedPage component={component} allowedTypes={["admin"] as const} />}
          />
        ))}
        
        {/* Admin, Selecao, Comum Routes */}
        {routeGroups.adminSelecaoComum.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedPage component={component} allowedTypes={["admin", "selecao", "comum"] as const} />}
          />
        ))}
        
        {/* Admin, Selecao, Gestor Routes */}
        {routeGroups.adminSelecaoGestor.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedPage component={component} allowedTypes={["admin", "selecao", "gestor"] as const} />}
          />
        ))}
        
        {/* Admin, Gestor Routes */}
        {routeGroups.adminGestor.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedPage component={component} allowedTypes={["admin", "gestor"] as const} />}
          />
        ))}
        
        {/* Selecao, Gestor, Colaborador, Comum Routes */}
        {routeGroups.selecaoGestorColaboradorComum.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedPage component={component} allowedTypes={["selecao", "gestor", "colaborador", "comum"] as const} />}
          />
        ))}
        
        {/* Comum Routes */}
        {routeGroups.comum.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedPage component={component} allowedTypes={["comum"] as const} />}
          />
        ))}
        
        {/* Gestor, Comum Routes */}
        {routeGroups.gestorComum.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedPage component={component} allowedTypes={["gestor", "comum"] as const} />}
          />
        ))}
        
        {/* Gestor Only Routes */}
        {routeGroups.gestorOnly.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedPage component={component} allowedTypes={["gestor"] as const} />}
          />
        ))}

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
});

AppRoutesComponent.displayName = 'AppRoutes';

// Ensure we have a named export and a default export
export { AppRoutesComponent as AppRoutes };
export default AppRoutesComponent;
