import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  // Validar formato da conta (10 dígitos)
  validarConta(conta: string): boolean {
    return /^[0-9]{10}$/.test(conta);
  }

  // Formatar conta para exibição (XXXX-XXXXXX)
  formatarConta(conta: string): string {
    if (conta && conta.length === 10) {
      return `${conta.substring(0, 4)}-${conta.substring(4)}`;
    }
    return conta;
  }

  // Formatar valor monetário
  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  // Formatar data
  formatarData(data: string): string {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  // Formatar data e hora
  formatarDataHora(data: string): string {
    if (!data) return '';
    return new Date(data).toLocaleString('pt-BR');
  }

  // Calcular dias entre duas datas
  calcularDiasEntreDatas(dataInicio: string, dataFim: string): number {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Obter data mínima (hoje) considerando timezone local
  getDataMinima(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // Obter data máxima (50 dias a partir de hoje) considerando timezone local
  getDataMaxima(): string {
    const hoje = new Date();
    const maxData = new Date(hoje);
    maxData.setDate(hoje.getDate() + 50);
    const ano = maxData.getFullYear();
    const mes = String(maxData.getMonth() + 1).padStart(2, '0');
    const dia = String(maxData.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // Validar se a data é válida para transferência
  validarDataTransferencia(data: string): boolean {
    const dataTransferencia = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return dataTransferencia >= hoje;
  }

  // Obter classe CSS para o status
  getStatusClass(status: string): string {
    switch (status) {
      case 'AGENDADA':
        return 'status-agendada';
      case 'REALIZADA':
        return 'status-realizada';
      case 'CANCELADA':
        return 'status-cancelada';
      default:
        return 'status-default';
    }
  }

  // Obter texto do status
  getStatusText(status: string): string {
    switch (status) {
      case 'AGENDADA':
        return 'Agendada';
      case 'REALIZADA':
        return 'Realizada';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  }
}
