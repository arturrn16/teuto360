import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/loader-spinner";

// Eager loaded components
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Lazy loaded components
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const Perfil = React.lazy(() => import("@/pages/Perfil"));
const MinhasSolicitacoes = React.lazy(() => import("@/pages/MinhasSolicitacoes"));
const TransporteRota = React.lazy(() => import("@/pages/TransporteRota"));
const Transporte12x36 = React.lazy(() => import("@/pages/Transporte12x36"));
const Refeicao = React.lazy(() => import("@/pages/Refeicao"));
const Admin = React.lazy(() => import("@/pages/Admin"));
const Relatorios = React.lazy(() => import("@/pages/Relatorios"));
const GerenciarComunicados = React.lazy(() => import("@/pages/GerenciarComunicados"));
const GerenciarCardapio = React.lazy(() => import("@/pages/GerenciarCardapio"));
const GerenciarCartoes = React.lazy(() => import("@/pages/GerenciarCartoes"));
const GerenciarUsuarios = React.lazy(() => import("@/pages/GerenciarUsuarios"));
const MapaRotas = React.lazy(() => import("@/pages/MapaRotas"));
const MudancaTurno = React.lazy(() => import("@/pages/MudancaTurno"));
const AlteracaoEndereco = React.lazy(() => import("@/pages/AlteracaoEndereco"));
const AdesaoCancelamento = React.lazy(() => import("@/pages/AdesaoCancelamento"));
const AbonoPonto = React.lazy(() => import("@/pages/AbonoPonto"));
const Plantao = React.lazy(() => import("@/pages/Plantao"));
const Avaliacao = React.lazy(() => import("@/pages/Avaliacao"));
const CardapioSemana = React.lazy(() => import("@/pages/CardapioSemana"));
const Comunicados = React.lazy(() => import("@/pages/Comunicados"));
const OfertaCaronas = React.lazy(() => import("@/pages/OfertaCaronas"));
const ConsultaCartao = React.lazy(() => import("@/pages/ConsultaCartao"));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/perfil" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><Perfil /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/minhas-solicitacoes" element={<Layout><ProtectedRoute><React.Suspense fallback={<PageLoader />}><MinhasSolicitacoes /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/transporte-rota" element={<Layout><ProtectedRoute allowedTypes={["selecao"]}><React.Suspense fallback={<PageLoader />}><TransporteRota /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/transporte-12x36" element={<Layout><ProtectedRoute allowedTypes={["selecao", "gestor"]}><React.Suspense fallback={<PageLoader />}><Transporte12x36 /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/refeicao" element={<Layout><ProtectedRoute allowedTypes={["gestor"]}><React.Suspense fallback={<PageLoader />}><Refeicao /></React.Suspense></ProtectedRoute></Layout>} />
      
      {/* Common user routes */}
      <Route path="/mapa-rotas" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><MapaRotas /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/mudanca-turno" element={<Layout><ProtectedRoute allowedTypes={["gestor"]}><React.Suspense fallback={<PageLoader />}><MudancaTurno /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/alteracao-endereco" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><AlteracaoEndereco /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/adesao-cancelamento" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><AdesaoCancelamento /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/abono-ponto" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><AbonoPonto /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/plantao" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><Plantao /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/avaliacao" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><Avaliacao /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/cardapio-semana" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><CardapioSemana /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/comunicados" element={<Layout><ProtectedRoute allowedTypes={["gestor", "comum", "colaborador"]}><React.Suspense fallback={<PageLoader />}><Comunicados /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/oferta-caronas" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><OfertaCaronas /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/consulta-cartao" element={<Layout><ProtectedRoute allowedTypes={["comum"]}><React.Suspense fallback={<PageLoader />}><ConsultaCartao /></React.Suspense></ProtectedRoute></Layout>} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<Layout><ProtectedRoute allowedTypes={["admin"]}><React.Suspense fallback={<PageLoader />}><Admin /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/relatorios" element={<Layout><ProtectedRoute allowedTypes={["admin"]}><React.Suspense fallback={<PageLoader />}><Relatorios /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/gerenciar-comunicados" element={<Layout><ProtectedRoute allowedTypes={["admin"]}><React.Suspense fallback={<PageLoader />}><GerenciarComunicados /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/gerenciar-cardapio" element={<Layout><ProtectedRoute allowedTypes={["admin"]}><React.Suspense fallback={<PageLoader />}><GerenciarCardapio /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/gerenciar-cartoes" element={<Layout><ProtectedRoute allowedTypes={["admin"]}><React.Suspense fallback={<PageLoader />}><GerenciarCartoes /></React.Suspense></ProtectedRoute></Layout>} />
      <Route path="/gerenciar-usuarios" element={<Layout><ProtectedRoute allowedTypes={["admin"]}><React.Suspense fallback={<PageLoader />}><GerenciarUsuarios /></React.Suspense></ProtectedRoute></Layout>} />
      
      {/* Not found route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
