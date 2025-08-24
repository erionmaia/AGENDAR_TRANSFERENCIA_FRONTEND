export interface Transferencia {
  id?: number;
  contaOrigem: string;
  contaDestino: string;
  valor: number;
  taxa: number;
  valorTotal?: number;
  dataTransferencia: string;
  dataAgendamento?: string;
  dataCriacao?: string;
  status?: StatusTransferencia;
  diasParaTransferencia?: number;
}

export enum StatusTransferencia {
  AGENDADA = 'AGENDADA',
  REALIZADA = 'REALIZADA',
  CANCELADA = 'CANCELADA'
}

export interface CalculoTaxa {
  valor: number;
  dataTransferencia: string;
  diasParaTransferencia: number;
  taxa: number;
  valorTotal: number;
  mensagem: string;
  sucesso: boolean;
}

export interface TransferenciaRequest {
  contaOrigem: string;
  contaDestino: string;
  valor: number;
  dataTransferencia: string;
}
