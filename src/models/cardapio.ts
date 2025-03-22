
export type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface ItemCardapio {
  pratosPrincipais: string[];
  guarnicoes: string[];
  saladas: string[];
  sobremesas: string[];
}

export interface Cardapio {
  id?: number;
  diaSemana: DiaSemana;
  data?: string; // ISO date string
  itens: ItemCardapio;
}

export const diasSemanaLabels: Record<DiaSemana, string> = {
  'segunda': 'Segunda-feira',
  'terca': 'Terça-feira',
  'quarta': 'Quarta-feira',
  'quinta': 'Quinta-feira',
  'sexta': 'Sexta-feira',
  'sabado': 'Sábado',
  'domingo': 'Domingo'
};

export const diasSemanaOrdem: DiaSemana[] = [
  'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'
];

export const cardapioVazio: ItemCardapio = {
  pratosPrincipais: [],
  guarnicoes: [],
  saladas: [],
  sobremesas: []
};
