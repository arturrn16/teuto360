
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GenerateTicketParams {
  id: number;
  tipo: 'rota' | '12x36' | 'refeicao';
}

export const generateTicket = async ({ id, tipo }: GenerateTicketParams): Promise<string | null> => {
  try {
    // Call the gerar-ticket edge function
    const { data, error } = await supabase.functions.invoke('gerar-ticket', {
      body: { id, tipo }
    });

    if (error) {
      console.error("Erro ao gerar ticket:", error);
      toast.error("Erro ao gerar ticket");
      return null;
    }

    if (!data.success) {
      toast.error(data.error || "Erro ao gerar ticket");
      return null;
    }

    // Create a canvas to generate JPEG from ticket data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 600;
    canvas.height = 300;
    
    // Exit if no canvas context
    if (!ctx) {
      toast.error("Erro ao criar imagem do ticket");
      return null;
    }
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Header
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(10, 10, canvas.width - 20, 50);
    
    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TICKET DE ' + tipo.toUpperCase(), canvas.width / 2, 45);
    
    // Content
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    const ticketData = data.ticket.dados;
    const y_start = 90;
    const line_height = 25;
    
    // Different content based on ticket type
    if (tipo === 'rota') {
      ctx.fillText(`Colaborador: ${ticketData.colaborador_nome}`, 30, y_start);
      ctx.fillText(`Cidade: ${ticketData.cidade}`, 30, y_start + line_height);
      ctx.fillText(`Turno: ${ticketData.turno}`, 30, y_start + line_height * 2);
      ctx.fillText(`Rota: ${ticketData.rota}`, 30, y_start + line_height * 3);
      ctx.fillText(`Período: ${new Date(ticketData.periodo_inicio).toLocaleDateString()} a ${new Date(ticketData.periodo_fim).toLocaleDateString()}`, 30, y_start + line_height * 4);
    } else if (tipo === '12x36') {
      ctx.fillText(`Colaborador: ${ticketData.colaborador_nome}`, 30, y_start);
      ctx.fillText(`Telefone: ${ticketData.telefone}`, 30, y_start + line_height);
      ctx.fillText(`Endereço: ${ticketData.endereco}`, 30, y_start + line_height * 2);
      ctx.fillText(`Rota: ${ticketData.rota}`, 30, y_start + line_height * 3);
      ctx.fillText(`Data de Início: ${new Date(ticketData.data_inicio).toLocaleDateString()}`, 30, y_start + line_height * 4);
    } else if (tipo === 'refeicao') {
      ctx.fillText(`Colaborador: ${ticketData.colaboradores.join(', ')}`, 30, y_start);
      ctx.fillText(`Tipo de Refeição: ${ticketData.tipo_refeicao}`, 30, y_start + line_height);
      ctx.fillText(`Data da Refeição: ${new Date(ticketData.data_refeicao).toLocaleDateString()}`, 30, y_start + line_height * 2);
    }
    
    // Footer message
    ctx.font = 'italic 14px Arial';
    if (tipo === 'rota' || tipo === '12x36') {
      ctx.fillText("Apresente este ticket ao motorista responsável pela rota", 30, y_start + line_height * 6);
    } else {
      ctx.fillText("Apresente este ticket no refeitório", 30, y_start + line_height * 5);
    }
    
    // Return dataURL
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error("Erro ao gerar ticket:", error);
    toast.error("Erro ao gerar ticket");
    return null;
  }
};

export const downloadTicket = async (params: GenerateTicketParams): Promise<void> => {
  toast.loading("Gerando ticket...");
  
  try {
    const dataUrl = await generateTicket(params);
    
    if (!dataUrl) {
      toast.error("Falha ao gerar ticket");
      return;
    }
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `ticket-${params.tipo}-${params.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Ticket gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao baixar ticket:", error);
    toast.error("Erro ao baixar ticket");
  }
};
