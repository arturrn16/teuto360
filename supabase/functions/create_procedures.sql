
-- Create functions for the new tables

-- Function to insert solicitacao_abono_ponto
CREATE OR REPLACE FUNCTION public.insert_solicitacao_abono_ponto(
  p_solicitante_id integer,
  p_cidade text,
  p_turno text,
  p_rota text,
  p_descricao text,
  p_status text DEFAULT 'pendente'
) RETURNS void AS $$
BEGIN
  INSERT INTO solicitacoes_abono_ponto (
    solicitante_id, 
    cidade, 
    turno, 
    rota, 
    descricao, 
    status
  ) VALUES (
    p_solicitante_id,
    p_cidade,
    p_turno,
    p_rota,
    p_descricao,
    p_status
  );
END;
$$ LANGUAGE plpgsql;

-- Function to insert solicitacao_adesao_cancelamento
CREATE OR REPLACE FUNCTION public.insert_solicitacao_adesao_cancelamento(
  p_solicitante_id integer,
  p_tipo_solicitacao text,
  p_email text,
  p_motivo text,
  p_status text DEFAULT 'pendente'
) RETURNS void AS $$
BEGIN
  INSERT INTO solicitacoes_adesao_cancelamento (
    solicitante_id, 
    tipo_solicitacao, 
    email, 
    motivo, 
    status
  ) VALUES (
    p_solicitante_id,
    p_tipo_solicitacao,
    p_email,
    p_motivo,
    p_status
  );
END;
$$ LANGUAGE plpgsql;

-- Function to insert solicitacao_alteracao_endereco
CREATE OR REPLACE FUNCTION public.insert_solicitacao_alteracao_endereco(
  p_solicitante_id integer,
  p_telefone text,
  p_cep text,
  p_endereco text,
  p_bairro text,
  p_cidade text,
  p_complemento text,
  p_telefone_whatsapp text,
  p_rota_atual text,
  p_alterar_rota boolean,
  p_nova_rota text,
  p_status text DEFAULT 'pendente'
) RETURNS void AS $$
BEGIN
  INSERT INTO solicitacoes_alteracao_endereco (
    solicitante_id, 
    telefone, 
    cep, 
    endereco, 
    bairro, 
    cidade, 
    complemento,
    telefone_whatsapp,
    rota_atual,
    alterar_rota,
    nova_rota,
    status
  ) VALUES (
    p_solicitante_id,
    p_telefone,
    p_cep,
    p_endereco,
    p_bairro,
    p_cidade,
    p_complemento,
    p_telefone_whatsapp,
    p_rota_atual,
    p_alterar_rota,
    p_nova_rota,
    p_status
  );
END;
$$ LANGUAGE plpgsql;

-- Function to insert solicitacao_mudanca_turno
CREATE OR REPLACE FUNCTION public.insert_solicitacao_mudanca_turno(
  p_solicitante_id integer,
  p_telefone text,
  p_cep text,
  p_endereco text,
  p_bairro text,
  p_cidade text,
  p_turno_atual text,
  p_novo_turno text,
  p_nova_rota text,
  p_nome_gestor text,
  p_motivo text,
  p_status text DEFAULT 'pendente'
) RETURNS void AS $$
BEGIN
  INSERT INTO solicitacoes_mudanca_turno (
    solicitante_id, 
    telefone, 
    cep, 
    endereco, 
    bairro, 
    cidade, 
    turno_atual,
    novo_turno,
    nova_rota,
    nome_gestor,
    motivo,
    status
  ) VALUES (
    p_solicitante_id,
    p_telefone,
    p_cep,
    p_endereco,
    p_bairro,
    p_cidade,
    p_turno_atual,
    p_novo_turno,
    p_nova_rota,
    p_nome_gestor,
    p_motivo,
    p_status
  );
END;
$$ LANGUAGE plpgsql;
