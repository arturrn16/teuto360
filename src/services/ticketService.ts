import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TEUTO_LOGO } from "@/App";
import { Colaborador } from "@/types/solicitacoes";

interface GenerateTicketParams {
  id: number;
  tipo: 'rota' | '12x36' | 'refeicao';
  colaboradorIndice?: number;
}

export const generateTicket = async ({ id, tipo, colaboradorIndice }: GenerateTicketParams): Promise<string | null> => {
  try {
    // Call the gerar-ticket edge function
    const { data, error } = await supabase.functions.invoke('gerar-ticket', {
      body: { id, tipo, colaboradorIndice }
    });

    if (error) {
      console.error("Erro ao gerar ticket:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao gerar ticket"
      });
      return null;
    }

    if (!data.success) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: data.error || "Erro ao gerar ticket"
      });
      return null;
    }

    // Create a canvas to generate JPEG from ticket data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions - make it look like a ticket
    canvas.width = 600;
    canvas.height = 300;
    
    // Exit if no canvas context
    if (!ctx) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao criar imagem do ticket"
      });
      return null;
    }
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Load and draw Teuto logo
    const logoImg = new Image();
    logoImg.src = TEUTO_LOGO;
    
    // Wait for the logo to load before drawing the rest of the ticket
    return new Promise((resolve) => {
      logoImg.onload = () => {
        // Draw logo in the top left
        const logoHeight = 40;
        const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
        ctx.drawImage(logoImg, 20, 15, logoWidth, logoHeight);
        
        // Header
        ctx.fillStyle = '#00A9E0'; // Teuto blue
        ctx.fillRect(logoWidth + 30, 10, canvas.width - logoWidth - 40, 50);
        
        // Header Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TICKET DE ' + tipo.toUpperCase(), canvas.width / 2 + 30, 45);
        
        // Content
        ctx.fillStyle = '#1f2937';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        
        const ticketData = data.ticket.dados;
        const y_start = 90;
        const line_height = 25;
        
        // Different content based on ticket type
        if (tipo === 'rota') {
          // Simplified route ticket with just matrícula, name, route, period and status
          ctx.fillText(`Matrícula: ${ticketData.matricula || 'N/A'}`, 30, y_start);
          ctx.fillText(`Colaborador: ${ticketData.colaborador_nome}`, 30, y_start + line_height);
          ctx.fillText(`Rota: ${ticketData.rota}`, 30, y_start + line_height * 2);
          ctx.fillText(`Período: ${new Date(ticketData.periodo_inicio).toLocaleDateString()} a ${new Date(ticketData.periodo_fim).toLocaleDateString()}`, 30, y_start + line_height * 3);
          ctx.fillText(`Status: ${ticketData.status.toUpperCase()}`, 30, y_start + line_height * 4);
        } else if (tipo === '12x36') {
          ctx.fillText(`Colaborador: ${ticketData.colaborador_nome}`, 30, y_start);
          ctx.fillText(`Telefone: ${ticketData.telefone}`, 30, y_start + line_height);
          ctx.fillText(`Endereço: ${ticketData.endereco}`, 30, y_start + line_height * 2);
          ctx.fillText(`Rota: ${ticketData.rota}`, 30, y_start + line_height * 3);
          ctx.fillText(`Data de Início: ${new Date(ticketData.data_inicio).toLocaleDateString()}`, 30, y_start + line_height * 4);
          ctx.fillText(`Status: ${ticketData.status.toUpperCase()}`, 30, y_start + line_height * 5);
        } else if (tipo === 'refeicao') {
          // Se for um ticket individual (com colaborador específico)
          if (ticketData.colaborador) {
            const colaborador = ticketData.colaborador;
            ctx.fillText(`Colaborador: ${colaborador.nome}`, 30, y_start);
            ctx.fillText(`Matrícula: ${colaborador.matricula}`, 30, y_start + line_height);
            ctx.fillText(`Tipo de Refeição: ${ticketData.tipo_refeicao}`, 30, y_start + line_height * 2);
            ctx.fillText(`Data da Refeição: ${new Date(ticketData.data_refeicao).toLocaleDateString()}`, 30, y_start + line_height * 3);
            ctx.fillText(`Status: ${ticketData.status.toUpperCase()}`, 30, y_start + line_height * 4);
          } else {
            // Comportamento legado (lista de colaboradores)
            const colaboradoresText = Array.isArray(ticketData.colaboradores)
              ? ticketData.colaboradores
                  .map((c: any) => {
                    if (typeof c === 'string') return c;
                    if (c && typeof c === 'object') return `${c.nome || ''} (${c.matricula || ''})`;
                    return '';
                  })
                  .filter(Boolean)
                  .join(', ')
              : '';
            
            ctx.fillText(`Colaboradores: ${colaboradoresText}`, 30, y_start);
            ctx.fillText(`Tipo de Refeição: ${ticketData.tipo_refeicao}`, 30, y_start + line_height);
            ctx.fillText(`Data da Refeição: ${new Date(ticketData.data_refeicao).toLocaleDateString()}`, 30, y_start + line_height * 2);
            ctx.fillText(`Status: ${ticketData.status.toUpperCase()}`, 30, y_start + line_height * 3);
          }
        }
        
        // Footer message
        ctx.font = 'italic 14px Arial';
        if (tipo === 'rota' || tipo === '12x36') {
          ctx.fillText("Apresente este ticket ao motorista responsável pela rota", 30, y_start + line_height * 6);
        } else {
          ctx.fillText("Apresente este ticket no refeitório", 30, y_start + line_height * 5);
        }
        
        // Footer with slogan
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#00A9E0'; // Teuto blue
        ctx.textAlign = 'right';
        ctx.fillText("SE É TEUTO, É DE CONFIANÇA", canvas.width - 30, canvas.height - 20);
        
        // Return dataURL
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      logoImg.onerror = () => {
        // If logo fails to load, continue with the regular ticket
        console.error("Erro ao carregar logo Teuto");
        
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
          ctx.fillText(`Matrícula: ${ticketData.matricula || 'N/A'}`, 30, y_start);
          ctx.fillText(`Colaborador: ${ticketData.colaborador_nome}`, 30, y_start + line_height);
          ctx.fillText(`Rota: ${ticketData.rota}`, 30, y_start + line_height * 2);
          ctx.fillText(`Período: ${new Date(ticketData.periodo_inicio).toLocaleDateString()} a ${new Date(ticketData.periodo_fim).toLocaleDateString()}`, 30, y_start + line_height * 3);
          ctx.fillText(`Status: ${ticketData.status.toUpperCase()}`, 30, y_start + line_height * 4);
        } else if (tipo === '12x36') {
          ctx.fillText(`Colaborador: ${ticketData.colaborador_nome}`, 30, y_start);
          ctx.fillText(`Telefone: ${ticketData.telefone}`, 30, y_start + line_height);
          ctx.fillText(`Endereço: ${ticketData.endereco}`, 30, y_start + line_height * 2);
          ctx.fillText(`Rota: ${ticketData.rota}`, 30, y_start + line_height * 3);
          ctx.fillText(`Data de Início: ${new Date(ticketData.data_inicio).toLocaleDateString()}`, 30, y_start + line_height * 4);
          ctx.fillText(`Status: ${ticketData.status.toUpperCase()}`, 30, y_start + line_height * 5);
        } else if (tipo === 'refeicao') {
          // Se for um ticket individual (com colaborador específico)
          if (ticketData.colaborador) {
            const colaborador = ticketData.colaborador;
            ctx.fillText(`Colaborador: ${colaborador.nome}`, 30, y_start);
            ctx.fillText(`Matrícula: ${colaborador.matricula}`, 30, y_start + line_height);
            ctx.fillText(`Tipo de Refeição: ${ticketData.tipo_refeicao}`, 30, y_start + line_height * 2);
            ctx.fillText(`Data da Refeição: ${new Date(ticketData.data_refeicao).toLocaleDateString()}`, 30, y_start + line_height * 3);
            ctx.fillText(`Status: ${ticketData.status.toUpperCase()}`, 30, y_start + line_height * 4);
          } else {
            // Comportamento legado (lista de colaboradores)
            const colaboradoresText = Array.isArray(ticketData.colaboradores)
              ? ticketData.colaboradores
                  .map((c: any) => {
                    if (typeof c === 'string') return c;
                    if (c && typeof c === 'object') return `${c.nome || ''} (${c.matricula || ''})`;
                    return '';
                  })
                  .filter(Boolean)
                  .join(', ')
              : '';
            
            ctx.fillText(`Colaboradores: ${colaboradoresText}`, 30, y_start);
            ctx.fillText(`Tipo de Refeição: ${ticketData.tipo_refeicao}`, 30, y_start + line_height);
            ctx.fillText(`Data da Refeição: ${new Date(ticketData.data_refeicao).toLocaleDateString()}`, 30, y_start + line_height * 2);
            ctx.fillText(`Status: ${ticketData.status.toUpperCase()}`, 30, y_start + line_height * 3);
          }
        }
        
        // Footer message
        ctx.font = 'italic 14px Arial';
        if (tipo === 'rota' || tipo === '12x36') {
          ctx.fillText("Apresente este ticket ao motorista responsável pela rota", 30, y_start + line_height * 6);
        } else {
          ctx.fillText("Apresente este ticket no refeitório", 30, y_start + line_height * 5);
        }
        
        // Return dataURL
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  } catch (error) {
    console.error("Erro ao gerar ticket:", error);
    toast({
      variant: "destructive",
      title: "Erro",
      description: "Erro ao gerar ticket"
    });
    return null;
  }
};

export const downloadTicket = async (params: GenerateTicketParams): Promise<void> => {
  toast({
    title: "Informação",
    description: "Gerando ticket..."
  });
  
  try {
    // Para solicitações de refeição, verificamos se precisamos gerar tickets individuais
    if (params.tipo === 'refeicao') {
      // Primeiro, vamos buscar a solicitação para saber quantos colaboradores tem
      const { data: solicitacao, error } = await supabase
        .from('solicitacoes_refeicao')
        .select('colaboradores')
        .eq('id', params.id)
        .single();
      
      if (error || !solicitacao) {
        throw new Error("Não foi possível encontrar a solicitação");
      }
      
      // Se tiver colaboradores, geramos um ticket para cada um
      if (solicitacao.colaboradores && solicitacao.colaboradores.length > 0) {
        // Informar ao usuário quantos tickets serão gerados
        toast({
          title: "Tickets",
          description: `Gerando ${solicitacao.colaboradores.length} tickets individuais...`
        });
        
        // Para cada colaborador, geramos e baixamos um ticket
        for (let i = 0; i < solicitacao.colaboradores.length; i++) {
          const dataUrl = await generateTicket({
            id: params.id,
            tipo: params.tipo,
            colaboradorIndice: i
          });
          
          if (!dataUrl) continue;
          
          const colaborador = solicitacao.colaboradores[i];
          const nome = typeof colaborador === 'string' ? colaborador : colaborador?.nome || 'colaborador';
          const matricula = typeof colaborador === 'object' ? colaborador?.matricula || '' : '';
          
          // Create a temporary link to download the image
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `ticket-${params.tipo}-${params.id}-${nome}-${matricula}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Pequeno timeout para não sobrecarregar o navegador
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        toast({
          title: "Sucesso",
          description: `${solicitacao.colaboradores.length} tickets gerados com sucesso!`
        });
        return;
      }
    }
    
    // Comportamento padrão para outros tipos de ticket
    const dataUrl = await generateTicket(params);
    
    if (!dataUrl) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao gerar ticket"
      });
      return;
    }
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `ticket-${params.tipo}-${params.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Sucesso",
      description: "Ticket gerado com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao baixar ticket:", error);
    toast({
      variant: "destructive",
      title: "Erro",
      description: "Erro ao baixar ticket"
    });
  }
};
