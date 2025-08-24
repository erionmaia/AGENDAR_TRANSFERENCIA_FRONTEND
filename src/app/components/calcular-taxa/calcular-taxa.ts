import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferenciaService } from '../../services/transferencia.service';
import { UtilService } from '../../services/util.service';
import { CalculoTaxa } from '../../models/transferencia.model';

@Component({
  selector: 'app-calcular-taxa',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './calcular-taxa.html',
  styleUrl: './calcular-taxa.scss'
})
export class CalcularTaxa implements OnInit {
  calculoForm: FormGroup;
  isLoading = false;
  resultado: CalculoTaxa | null = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private transferenciaService: TransferenciaService,
    public utilService: UtilService
  ) {
    this.calculoForm = this.fb.group({
      valor: ['', [Validators.required, Validators.min(0.01)]],
      dataTransferencia: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Definir data mínima como hoje
    const dataMinima = this.utilService.getDataMinima();
    this.calculoForm.patchValue({
      dataTransferencia: dataMinima
    });
  }

  onSubmit(): void {
    if (this.calculoForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.resultado = null;

      const { valor, dataTransferencia } = this.calculoForm.value;

      this.transferenciaService.calcularTaxa(valor, dataTransferencia).subscribe({
        next: (calculo) => {
          this.isLoading = false;
          this.resultado = calculo;
          console.log('✅ Taxa calculada:', calculo);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('❌ Erro ao calcular taxa:', error);
          this.errorMessage = error.message || 'Erro ao calcular taxa. Tente novamente.';
        }
      });
    }
  }

  limparResultado(): void {
    this.resultado = null;
    this.errorMessage = '';
  }

  getFieldError(fieldName: string): string {
    const field = this.calculoForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['min']) return 'Valor deve ser maior que zero';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.calculoForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
