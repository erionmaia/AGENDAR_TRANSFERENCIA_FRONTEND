import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransferenciaService } from '../../services/transferencia.service';
import { UtilService } from '../../services/util.service';
import { CalculoTaxa, TransferenciaRequest } from '../../models/transferencia.model';

@Component({
  selector: 'app-agendar-transferencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agendar-transferencia.html',
  styleUrl: './agendar-transferencia.scss'
})
export class AgendarTransferencia implements OnInit {
  transferenciaForm: FormGroup;
  isLoading = false;
  taxaCalculada = false;
  calculoTaxa: CalculoTaxa | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private transferenciaService: TransferenciaService,
    public utilService: UtilService,
    private router: Router
  ) {
    this.transferenciaForm = this.fb.group({
      contaOrigem: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      contaDestino: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      dataTransferencia: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Definir data mínima como hoje
    const hoje = this.utilService.getDataMinima();
    this.transferenciaForm.patchValue({
      dataTransferencia: hoje
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transferenciaForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.transferenciaForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['pattern']) return 'Formato inválido';
      if (field.errors['min']) return 'Valor deve ser maior que zero';
    }
    return '';
  }

  calcularTaxa(): void {
    if (this.transferenciaForm.valid) {
      const formValue = this.transferenciaForm.value;
      
      this.transferenciaService.calcularTaxa(
        formValue.valor,
        formValue.dataTransferencia
      ).subscribe({
        next: (resultado) => {
          this.calculoTaxa = resultado;
          this.taxaCalculada = true;
          this.errorMessage = '';
          
          if (!resultado.sucesso) {
            this.errorMessage = resultado.mensagem;
          }
        },
        error: (error) => {
          this.errorMessage = 'Erro ao calcular taxa. Tente novamente.';
          console.error('Erro ao calcular taxa:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.transferenciaForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const transferencia: TransferenciaRequest = {
        contaOrigem: this.transferenciaForm.value.contaOrigem,
        contaDestino: this.transferenciaForm.value.contaDestino,
        valor: this.transferenciaForm.value.valor,
        dataTransferencia: this.transferenciaForm.value.dataTransferencia
      };

      this.transferenciaService.agendarTransferencia(transferencia).subscribe({
        next: (resultado) => {
          this.successMessage = `Transferência agendada com sucesso! ID: ${resultado.id}`;
          this.isLoading = false;
          
          // Limpar formulário após sucesso
          setTimeout(() => {
            this.transferenciaForm.reset();
            this.taxaCalculada = false;
            this.calculoTaxa = null;
            this.successMessage = '';
            this.router.navigate(['/extrato']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erro ao agendar transferência. Tente novamente.';
          console.error('Erro ao agendar transferência:', error);
        }
      });
    }
  }
}
