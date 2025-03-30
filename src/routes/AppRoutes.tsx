
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageLoader } from "@/components/ui/loader-spinner";

// Lazy-loaded pages for better performance
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Comunicados = lazy(() => import("@/pages/Comunicados"));
const CardapioSemana = lazy(() => import("@/pages/CardapioSemana"));
const GerenciarCardapio = lazy(() => import("@/pages/GerenciarCardapio"));
const GerenciarComunicados = lazy(() => import("@/pages/GerenciarComunicados"));
const Admin = lazy(() => import("@/pages/Admin"));
const GerenciarUsuarios = lazy(() => import("@/pages/GerenciarUsuarios"));
const ConsultaCartao = lazy(() => import("@/pages/ConsultaCartao"));
const GerenciarCartoes = lazy(() => import("@/pages/GerenciarCartoes"));
const Refeicao = lazy(() => import("@/pages/Refeicao"));
const Avaliacao = lazy(() => import("@/pages/Avaliacao"));
const TransporteRota = lazy(() => import("@/pages/TransporteRota"));
const Transporte12x36 = lazy(() => import("@/pages/Transporte12x36"));
const OfertaCaronas = lazy(() => import("@/pages/OfertaCaronas"));
const MapaRotas = lazy(() => import("@/pages/MapaRotas"));
const AbonoPonto = lazy(() => import("@/pages/AbonoPonto"));
const AdesaoCancelamento = lazy(() => import("@/pages/AdesaoCancelamento"));
const AlteracaoEndereco = lazy(() => import("@/pages/AlteracaoEndereco"));
const MudancaTurno = lazy(() => import("@/pages/MudancaTurno"));
const MinhasSolicitacoes = lazy(() => import("@/pages/MinhasSolicitacoes"));
const Relatorios = lazy(() => import("@/pages/Relatorios"));
const Plantao = lazy(() => import("@/pages/Plantao"));
const Perfil = lazy(() => import("@/pages/Perfil"));

export const AppRoutes = () => {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/comunicados" element={<Comunicados />} />
          <Route path="/cardapio-semana" element={<CardapioSemana />} />
          <Route path="/gerenciar-cardapio" element={<GerenciarCardapio />} />
          <Route path="/gerenciar-comunicados" element={<GerenciarComunicados />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />
          <Route path="/consulta-cartao" element={<ConsultaCartao />} />
          <Route path="/gerenciar-cartoes" element={<GerenciarCartoes />} />
          <Route path="/refeicao" element={<Refeicao />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="/transporte-rota" element={<TransporteRota />} />
          <Route path="/transporte-12x36" element={<Transporte12x36 />} />
          <Route path="/oferta-caronas" element={<OfertaCaronas />} />
          <Route path="/mapa-rotas" element={<MapaRotas />} />
          <Route path="/abono-ponto" element={<AbonoPonto />} />
          <Route path="/adesao-cancelamento" element={<AdesaoCancelamento />} />
          <Route path="/alteracao-endereco" element={<AlteracaoEndereco />} />
          <Route path="/mudanca-turno" element={<MudancaTurno />} />
          <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/plantao" element={<Plantao />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};
