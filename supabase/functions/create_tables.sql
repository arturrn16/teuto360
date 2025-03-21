
-- Create necessary tables if they don't exist

-- Table for solicitacao_abono_ponto
CREATE TABLE IF NOT EXISTS public.solicitacoes_abono_ponto (
  id SERIAL PRIMARY KEY,
  solicitante_id INTEGER REFERENCES public.usuarios(id),
  cidade TEXT NOT NULL,
  turno TEXT NOT NULL, 
  rota TEXT NOT NULL,
  descricao TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for solicitacao_adesao_cancelamento
CREATE TABLE IF NOT EXISTS public.solicitacoes_adesao_cancelamento (
  id SERIAL PRIMARY KEY,
  solicitante_id INTEGER REFERENCES public.usuarios(id),
  tipo_solicitacao TEXT NOT NULL, 
  email TEXT NOT NULL, 
  motivo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for solicitacao_alteracao_endereco
CREATE TABLE IF NOT EXISTS public.solicitacoes_alteracao_endereco (
  id SERIAL PRIMARY KEY,
  solicitante_id INTEGER REFERENCES public.usuarios(id),
  telefone TEXT NOT NULL,
  cep TEXT NOT NULL,
  endereco TEXT NOT NULL,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  complemento TEXT,
  telefone_whatsapp TEXT NOT NULL,
  rota_atual TEXT NOT NULL,
  alterar_rota BOOLEAN DEFAULT false,
  nova_rota TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for solicitacao_mudanca_turno
CREATE TABLE IF NOT EXISTS public.solicitacoes_mudanca_turno (
  id SERIAL PRIMARY KEY,
  solicitante_id INTEGER REFERENCES public.usuarios(id),
  telefone TEXT NOT NULL,
  cep TEXT NOT NULL,
  endereco TEXT NOT NULL,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  turno_atual TEXT NOT NULL,
  novo_turno TEXT NOT NULL,
  nova_rota TEXT NOT NULL,
  nome_gestor TEXT NOT NULL,
  motivo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update the tipo_usuario column in usuarios table to allow 'colaborador' value
ALTER TABLE public.usuarios 
DROP CONSTRAINT IF EXISTS usuarios_tipo_usuario_check;

ALTER TABLE public.usuarios 
ADD CONSTRAINT usuarios_tipo_usuario_check 
CHECK (tipo_usuario IN ('admin', 'selecao', 'refeicao', 'colaborador'));

-- Update existing 'comum' users to 'selecao'
UPDATE public.usuarios 
SET tipo_usuario = 'selecao' 
WHERE tipo_usuario = 'comum';
