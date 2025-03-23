import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  supabase, 
  queryCustomTable,
  updateCustomTable,
  BaseSolicitacao,
  SolicitacaoAbonoPonto as AbonoPontoType,
  SolicitacaoAdesaoCancelamento as AdesaoCancelamentoType,
  SolicitacaoAlteracaoEndereco as AlteracaoEnderecoType,
  SolicitacaoMudancaTurno as MudancaTurnoType
} from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Download, 
  FileText, 
  Map, 
  Route, 
  Search, 
  Utensils, 
  XCircle,
  Home,
  ClipboardCheck,
  Replace
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Solicitacao {
  id: number;
  status: string;
  created_at: string;
  solicitante_id: number;
  solicitante?: {
    nome: string;
    setor: string;
  };
}

interface SolicitacaoTransporteRota extends Solicitacao {
  colaborador_nome: string;
  cidade: string;
  turno: string;
  rota: string;
  periodo_inicio: string;
  periodo_fim: string;
  motivo: string;
}

interface SolicitacaoTransporte12x36 extends Solicitacao {
  colaborador_nome: string;
  telefone: string;
  endereco: string;
  cep: string;
  rota: string;
  data_inicio: string;
}

interface SolicitacaoRefeicao extends Solicitacao {
  colaboradores: string[];
  tipo_refeicao: string;
  data_refeicao: string;
}

interface SolicitacaoAbonosPonto extends Solicitacao {
  data_ocorrencia: string;
  turno: string;
  motivo: string;
}

interface SolicitacaoAdesaoCancelamento extends Solicitacao {
  tipo_solicitacao: string;
  motivo: string;
}

interface SolicitacaoAlteracaoEndereco extends Solicitacao {
  endereco_atual: string;
  endereco_novo: string;
  data_alteracao: string;
  comprovante_url?: string;
}

interface SolicitacaoMudancaTurno extends Solicitacao {
  turno_atual: string;
  turno_novo: string;
  data_alteracao: string;
  motivo: string;
}

const Admin = () => {
  const { user } = useAuth();
  const [solicitacoesRota, setSolicitacoesRota] = useState<SolicitacaoTransporteRota[]>([]);
  const [solicitacoes12x36, setSolicitacoes12x36] = useState<SolicitacaoTransporte12x36[]>([]);
  const [solicitacoesRefeicao, setSolicitacoesRefeicao] = useState<SolicitacaoRefeicao[]>([]);
  const [solicitacoesAbonoPonto, setSolicitacoesAbonoPonto] = useState<SolicitacaoAbonosPonto[]>([]);
  const [solicitacoesAdesaoCancelamento, setSolicitacoesAdesaoCancelamento] = useState<SolicitacaoAdesaoCancelamento[]>([]);
  const [solicitacoesAlteracaoEndereco, setSolicitacoesAlteracaoEndereco] = useState<SolicitacaoAlteracaoEndereco[]>([]);
  const [solicitacoesMudancaTurno, setSolicitacoesMudancaTurno] = useState<SolicitacaoMudancaTurno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroColaborador, setFiltroColaborador] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [solicitantesInfo, setSolicitantesInfo] = useState<{[id: number]: {nome: string, setor: string}}>({});



