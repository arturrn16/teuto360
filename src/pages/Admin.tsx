import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  SolicitacaoAdesaoCancelamento,
  SolicitacaoAlteracaoEndereco,
  SolicitacaoMudancaTurno,
  SolicitacaoRefeicao,
  SolicitacaoTransporteRota,
  SolicitacaoTransporte12x36,
  SolicitacaoAbonoPonto,
} from '@/types/solicitacoes';
import { PageLoader } from '@/components/ui/loader-spinner';

const Admin = () => {
  const [solicitacoesEndereco, setSolicitacoesEndereco] = useState<SolicitacaoAlteracaoEndereco[]>([]);
  const [solicitacoesTurno, setSolicitacoesTurno] = useState<SolicitacaoMudancaTurno[]>([]);
  const [solicitacoesAdesao, setSolicitacoesAdesao] = useState<SolicitacaoAdesaoCancelamento[]>([]);
  const [solicitacoesRefeicao, setSolicitacoesRefeicao] = useState<SolicitacaoRefeicao[]>([]);
  const [solicitacoesTransporte, setSolicitacoesTransporte] = useState<SolicitacaoTransporteRota[]>([]);
  const [solicitacoesTransporte12x36, setSolicitacoesTransporte12x36] = useState<SolicitacaoTransporte12x36[]>([]);
  const [solicitacoesAbono, setSolicitacoesAbono] = useState<SolicitacaoAbonoPonto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSolicitacoes = async () => {
    try {
      setIsLoading(true);
      
      // Fetch solicitações de alteração de endereço
      const { data: enderecoData, error: enderecoError } = await supabase
        .from('solicitacoes_alteracao_endereco')
        .select('*');
      
      if (enderecoError) throw enderecoError;
      setSolicitacoesEndereco(enderecoData || []);
      
      // Fetch solicitações de mudança de turno
      const { data: turnoData, error: turnoError } = await supabase
        .from('solicitacoes_mudanca_turno')
        .select('*');
      
      if (turnoError) throw turnoError;
      setSolicitacoesTurno(turnoData || []);
      
      // Fetch solicitações de adesão/cancelamento
      const { data: adesaoData, error: adesaoError } = await supabase
        .from('solicitacoes_adesao_cancelamento')
        .select('*');
      
      if (adesaoError) throw adesaoError;
      setSolicitacoesAdesao(adesaoData || []);

      // Fetch solicitações de refeição
      const { data: refeicaoData, error: refeicaoError } = await supabase
        .from('solicitacoes_refeicao')
        .select('*');
      
      if (refeicaoError) throw refeicaoError;
      
      // Ensure that colaboradores is treated as an array before setting state
      const formattedRefeicaoData = refeicaoData?.map(item => ({
        ...item,
        colaboradores: Array.isArray(item.colaboradores) ? item.colaboradores : []
      }));
      
      setSolicitacoesRefeicao(formattedRefeicaoData || []);
      
      // Fetch solicitações de transporte
      const { data: transporteData, error: transporteError } = await supabase
        .from('solicitacoes_transporte_rota')
        .select('*');
      
      if (transporteError) throw transporteError;
      setSolicitacoesTransporte(transporteData || []);
      
      // Fetch solicitações de transporte 12x36
      const { data: transporte12x36Data, error: transporte12x36Error } = await supabase
        .from('solicitacoes_transporte_12x36')
        .select('*');
      
      if (transporte12x36Error) throw transporte12x36Error;
      setSolicitacoesTransporte12x36(transporte12x36Data || []);

      // Fetch solicitações de abono de ponto
      const { data: abonoData, error: abonoError } = await supabase
        .from('solicitacoes_abono_ponto')
        .select('*');
      
      if (abonoError) throw abonoError;
      setSolicitacoesAbono(abonoData || []);
      
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Painel de Administração</h1>

      {/* Solicitações de Alteração de Endereço */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Solicitações de Alteração de Endereço</h2>
        {solicitacoesEndereco.length > 0 ? (
          <ul className="list-disc pl-5">
            {solicitacoesEndereco.map((solicitacao) => (
              <li key={solicitacao.id}>
                ID: {solicitacao.id}, Endereço: {solicitacao.endereco}, Cidade: {solicitacao.cidade}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma solicitação de alteração de endereço encontrada.</p>
        )}
      </div>

      {/* Solicitações de Mudança de Turno */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Solicitações de Mudança de Turno</h2>
        {solicitacoesTurno.length > 0 ? (
          <ul className="list-disc pl-5">
            {solicitacoesTurno.map((solicitacao) => (
              <li key={solicitacao.id}>
                ID: {solicitacao.id}, Turno Atual: {solicitacao.turno_atual}, Novo Turno: {solicitacao.novo_turno}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma solicitação de mudança de turno encontrada.</p>
        )}
      </div>

      {/* Solicitações de Adesão/Cancelamento */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Solicitações de Adesão/Cancelamento</h2>
        {solicitacoesAdesao.length > 0 ? (
          <ul className="list-disc pl-5">
            {solicitacoesAdesao.map((solicitacao) => (
              <li key={solicitacao.id}>
                ID: {solicitacao.id}, Tipo: {solicitacao.tipo_solicitacao}, Motivo: {solicitacao.motivo}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma solicitação de adesão/cancelamento encontrada.</p>
        )}
      </div>

      {/* Solicitações de Refeição */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Solicitações de Refeição</h2>
        {solicitacoesRefeicao.length > 0 ? (
          <ul className="list-disc pl-5">
            {solicitacoesRefeicao.map((solicitacao) => (
              <li key={solicitacao.id}>
                ID: {solicitacao.id}, Tipo: {solicitacao.tipo_refeicao}, Data: {solicitacao.data_refeicao}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma solicitação de refeição encontrada.</p>
        )}
      </div>

      {/* Solicitações de Transporte */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Solicitações de Transporte</h2>
        {solicitacoesTransporte.length > 0 ? (
          <ul className="list-disc pl-5">
            {solicitacoesTransporte.map((solicitacao) => (
              <li key={solicitacao.id}>
                ID: {solicitacao.id}, Colaborador: {solicitacao.colaborador_nome}, Rota: {solicitacao.rota}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma solicitação de transporte encontrada.</p>
        )}
      </div>

      {/* Solicitações de Transporte 12x36 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Solicitações de Transporte 12x36</h2>
        {solicitacoesTransporte12x36.length > 0 ? (
          <ul className="list-disc pl-5">
            {solicitacoesTransporte12x36.map((solicitacao) => (
              <li key={solicitacao.id}>
                ID: {solicitacao.id}, Colaborador: {solicitacao.colaborador_nome}, Rota: {solicitacao.rota}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma solicitação de transporte 12x36 encontrada.</p>
        )}
      </div>

      {/* Solicitações de Abono de Ponto */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Solicitações de Abono de Ponto</h2>
        {solicitacoesAbono.length > 0 ? (
          <ul className="list-disc pl-5">
            {solicitacoesAbono.map((solicitacao) => (
              <li key={solicitacao.id}>
                ID: {solicitacao.id}, Data: {solicitacao.data_ocorrencia}, Motivo: {solicitacao.motivo}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma solicitação de abono de ponto encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
