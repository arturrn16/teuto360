
import { lazy, Suspense, memo } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PageLoader } from '@/components/ui/loader-spinner';
import { ProtectedRoute } from '@/context/AuthContext';

// Import pages with lower precedence to optimize loading
const Index = lazy(() => import('@/pages/Index').then(module => ({ default: module.default })));
const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.default })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.default })));
const NotFound = lazy(() => import('@/pages/NotFound').then(module => ({ default: module.default })));

// Admin pages
const Admin = lazy(() => import('@/pages/Admin').then(module => ({ default: module.default })));
const Relatorios = lazy(() => import('@/pages/Relatorios').then(module => ({ default: module.default })));
const GerenciarComunicados = lazy(() => import('@/pages/GerenciarComunicados').then(module => ({ default: module.default })));
const GerenciarCardapio = lazy(() => import('@/pages/GerenciarCardapio').then(module => ({ default: module.default })));
const GerenciarCartoes = lazy(() => import('@/pages/GerenciarCartoes').then(module => ({ default: module.default })));
const GerenciarUsuarios = lazy(() => import('@/pages/GerenciarUsuarios').then(module => ({ default: module.default })));

// Regular pages
const TransporteRota = lazy(() => import('@/pages/TransporteRota').then(module => ({ default: module.default })));
const Transporte12x36 = lazy(() => import('@/pages/Transporte12x36').then(module => ({ default: module.default })));
const Refeicao = lazy(() => import('@/pages/Refeicao').then(module => ({ default: module.default })));
const Comunicados = lazy(() => import('@/pages/Comunicados').then(module => ({ default: module.default })));
const MinhasSolicitacoes = lazy(() => import('@/pages/MinhasSolicitacoes').then(module => ({ default: module.default })));
const MapaRotas = lazy(() => import('@/pages/MapaRotas').then(module => ({ default: module.default })));
const AdesaoCancelamento = lazy(() => import('@/pages/AdesaoCancelamento').then(module => ({ default: module.default })));
const MudancaTurno = lazy(() => import('@/pages/MudancaTurno').then(module => ({ default: module.default })));
const AlteracaoEndereco = lazy(() => import('@/pages/AlteracaoEndereco').then(module => ({ default: module.default })));
const AbonoPonto = lazy(() => import('@/pages/AbonoPonto').then(module => ({ default: module.default })));
const Avaliacao = lazy(() => import('@/pages/Avaliacao').then(module => ({ default: module.default })));
const Plantao = lazy(() => import('@/pages/Plantao').then(module => ({ default: module.default })));
const OfertaCaronas = lazy(() => import('@/pages/OfertaCaronas').then(module => ({ default: module.default })));
const ConsultaCartao = lazy(() => import('@/pages/ConsultaCartao').then(module => ({ default: module.default })));
const CardapioSemana = lazy(() => import('@/pages/CardapioSemana').then(module => ({ default: module.default })));

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
export const AppRoutes = memo(() => {
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

AppRoutes.displayName = 'AppRoutes';
