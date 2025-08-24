import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TransferenciaService } from '../../services/transferencia.service';
import { UtilService } from '../../services/util.service';
import { Transferencia, StatusTransferencia } from '../../models/transferencia.model';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './extrato.html',
  styleUrl: './extrato.scss'
})
export class Extrato implements OnInit {
  transferencias: Transferencia[] = [];
  transferenciasFiltered: Transferencia[] = [];
  isLoading = false;
  errorMessage = '';
  
  filtroForm: FormGroup;
  
  // Filtros
  filtroStatus = '';
  filtroContaOrigem = '';
  filtroContaDestino = '';
  filtroPeriodoInicio = '';
  filtroPeriodoFim = '';

  constructor(
    private fb: FormBuilder,
    private transferenciaService: TransferenciaService,
    public utilService: UtilService
  ) {
    this.filtroForm = this.fb.group({
      status: [''],
      contaOrigem: [''],
      contaDestino: [''],
      periodoInicio: [''],
      periodoFim: ['']
    });
  }

  ngOnInit(): void {
    this.carregarTransferencias();
    
    // Observar mudanças no formulário de filtro
    this.filtroForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  carregarTransferencias(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.transferenciaService.listarTransferencias().subscribe({
      next: (transferencias) => {
        this.isLoading = false;
        this.transferencias = transferencias;
        this.transferenciasFiltered = transferencias;
        console.log('✅ Transferências carregadas:', transferencias.length);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Erro ao carregar transferências:', error);
        this.errorMessage = error.message || 'Erro ao carregar extrato. Tente novamente.';
      }
    });
  }

  aplicarFiltros(): void {
    const filtros = this.filtroForm.value;
    let resultado = [...this.transferencias];

    // Filtro por status
    if (filtros.status) {
      resultado = resultado.filter(t => t.status === filtros.status);
    }

    // Filtro por conta origem
    if (filtros.contaOrigem) {
      resultado = resultado.filter(t => 
        t.contaOrigem.includes(filtros.contaOrigem)
      );
    }

    // Filtro por conta destino
    if (filtros.contaDestino) {
      resultado = resultado.filter(t => 
        t.contaDestino.includes(filtros.contaDestino)
      );
    }

    // Filtro por período
    if (filtros.periodoInicio) {
      resultado = resultado.filter(t => 
        new Date(t.dataTransferencia) >= new Date(filtros.periodoInicio)
      );
    }

    if (filtros.periodoFim) {
      resultado = resultado.filter(t => 
        new Date(t.dataTransferencia) <= new Date(filtros.periodoFim)
      );
    }

    this.transferenciasFiltered = resultado;
  }

  limparFiltros(): void {
    this.filtroForm.reset();
    this.transferenciasFiltered = this.transferencias;
  }

  cancelarTransferencia(id: number): void {
    if (confirm('Tem certeza que deseja cancelar esta transferência?')) {
      this.transferenciaService.cancelarTransferencia(id).subscribe({
        next: () => {
          console.log('✅ Transferência cancelada');
          this.carregarTransferencias(); // Recarregar lista
        },
        error: (error) => {
          console.error('❌ Erro ao cancelar transferência:', error);
          alert('Erro ao cancelar transferência: ' + (error.message || 'Tente novamente.'));
        }
      });
    }
  }

  getStatusOptions(): StatusTransferencia[] {
    const statusUnicos = [...new Set(this.transferencias.map(t => t.status))];
    return statusUnicos.filter((s): s is StatusTransferencia => s !== undefined && s !== null); // Remove valores nulos/undefined
  }

  getTotalTransferencias(): number {
    return this.transferenciasFiltered.reduce((total, t) => total + (t.valorTotal || t.valor + t.taxa), 0);
  }

  getTotalTaxas(): number {
    return this.transferenciasFiltered.reduce((total, t) => total + t.taxa, 0);
  }

  trackByTransferenciaId(index: number, transferencia: Transferencia): number {
    return transferencia.id || index;
  }
}
