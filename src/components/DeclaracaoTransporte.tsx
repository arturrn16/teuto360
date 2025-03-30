
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { TEUTO_LOGO } from "@/App";

interface DeclaracaoTransporteProps {
  tipo: "Aderir" | "Cancelar";
  tipoTransporte?: "Fretado" | "ValeTransporte";
  usuario: {
    nome: string;
    matricula: string;
    cargo: string;
    setor: string;
  } | null;
  endereco?: {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
  };
  signatureDataUrl: string | null;
}

export const DeclaracaoTransporte = ({ 
  tipo, 
  tipoTransporte, 
  usuario, 
  endereco, 
  signatureDataUrl 
}: DeclaracaoTransporteProps) => {
  if (!usuario) return null;

  const dataAtual = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <div className="border border-gray-300 bg-white p-8 rounded-md text-sm w-full max-w-[800px] mx-auto">
      <div className="flex justify-between items-center border-b-2 border-gray-400 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <img src={TEUTO_LOGO} alt="Teuto Logo" className="h-10 object-contain" />
          <span className="text-xs text-gray-600">SE É TEUTO, É DE CONFIANÇA</span>
        </div>
        <div className="font-bold text-xl">
          {tipo === "Aderir" ? "DECLARAÇÃO DE OPÇÃO DE VALE TRANSPORTE" : "DECLARAÇÃO DE DISPENSA DO VALE TRANSPORTE"}
        </div>
      </div>

      <div className="border-2 border-gray-300 bg-gray-100 py-2 px-4 text-center font-bold mb-4">
        Informações da Empresa
      </div>
      <div className="border border-gray-300 py-2 px-4 mb-4">
        <div className="font-bold">Empresa</div>
        LABORATÓRIO TEUTO BRASILEIRO S/A
      </div>
      <div className="border border-gray-300 py-2 px-4 mb-6">
        <div className="font-bold">Endereço</div>
        VL VP 7D MOD 11 QD 13 - DAIA
      </div>

      <div className="border-2 border-gray-300 bg-gray-100 py-2 px-4 text-center font-bold mb-4">
        Informações do Funcionário
      </div>
      <div className="border border-gray-300 py-2 px-4 mb-4">
        <div className="font-bold">Funcionário</div>
        {usuario.matricula} - {usuario.nome}
      </div>
      <div className="border border-gray-300 py-2 px-4 mb-4">
        <div className="font-bold">Cargo / Setor</div>
        {usuario.cargo} / {usuario.setor}
      </div>

      {endereco && (
        <div className="border border-gray-300 py-2 px-4 mb-6">
          <div className="font-bold">Endereço Residencial</div>
          {endereco.rua}, {endereco.bairro}, {endereco.cidade} - CEP: {endereco.cep}
        </div>
      )}

      {tipo === "Aderir" ? (
        <>
          <div className="py-2 px-4 mb-6">
            <p className="mb-4 font-semibold">1. Deseja participar do sistema de Vale Transporte?</p>
            <p className="mb-4 ml-4">SIM ( X )</p>
            <p className="mb-4 ml-4">{tipoTransporte === "Fretado" ? "( X )" : "( \u00A0 )"} TRANSPORTE FRETADO</p>
            <p className="mb-4 ml-4">{tipoTransporte === "ValeTransporte" ? "( X )" : "( \u00A0 )"} VALE TRANSPORTE</p>
          </div>
          
          <div className="text-center font-bold mb-6 text-lg">AUTORIZAÇÃO DE DESCONTO</div>
          
          <div className="px-4 mb-8 text-justify">
            <p>
              Autorizo a LABORATÓRIO TEUTO BRASILEIRO S/A, descontar até 6% do meu salário contratual, limitado às minhas despesas com transporte para participar como beneficiário do programa Vale Transporte.
            </p>
            <p className="mt-4">
              Comprometo-me a utilizar este benefício, EXCLUSIVAMENTE no meu deslocamento residência / trabalho e vice-versa, e comunicar por escrito qualquer alteração que houver nas informações acima, submetendo-me às penalidades previstas em lei.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="py-2 px-4 mb-6">
            <p className="mb-4 font-semibold">1. Deseja participar do sistema de Vale Transporte?</p>
            <p className="mb-4 ml-4">NÃO ( X )</p>
            <p className="mb-4 ml-4">{tipoTransporte === "Fretado" ? "( X )" : "( \u00A0 )"} TRANSPORTE FRETADO</p>
            <p className="mb-4 ml-4">{tipoTransporte === "ValeTransporte" ? "( X )" : "( \u00A0 )"} VALE TRANSPORTE</p>
          </div>
          
          <div className="px-4 mb-8 text-justify">
            <p>
              Eu, {usuario.nome}, contratado(a) nesta empresa, declaro para todos os fins que nesta data estou residindo no endereço acima mencionado, portanto esclareço que para meu deslocamento de Residência-Trabalho e vice-versa, NÃO UTILIZO O TRANSPORTE PÚBLICO.
            </p>
          </div>
        </>
      )}
      
      <div className="flex flex-col items-center mt-10 mb-6">
        <div className="border-t-2 border-black w-72 py-1">
          {signatureDataUrl ? (
            <img src={signatureDataUrl} alt="Assinatura" className="h-16 object-contain mx-auto" />
          ) : (
            <div className="h-16 flex items-center justify-center text-gray-400">Assinatura pendente</div>
          )}
        </div>
        <div className="font-semibold mt-2">{usuario.nome}</div>
      </div>
      
      <div className="text-right mt-8">
        Anápolis, {dataAtual}
      </div>
    </div>
  );
};
