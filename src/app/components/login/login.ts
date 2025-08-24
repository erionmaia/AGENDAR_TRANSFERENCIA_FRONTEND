import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  backendStatus = 'Verificando...';
  backendOnline = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private healthService: HealthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Se já estiver logado, redirecionar para home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    
    // Verificar status do backend
    this.checkBackendStatus();
  }

  private checkBackendStatus(): void {
    this.healthService.isBackendOnline().subscribe(isOnline => {
      this.backendOnline = isOnline;
      this.backendStatus = isOnline ? 'Online' : 'Offline';
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;
      
      // Usar API real do backend
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('✅ Login realizado com sucesso:', response.nomeCompleto);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('❌ Erro no login:', error);
          
          // Tratar diferentes tipos de erro
          if (error.status === 401) {
            this.errorMessage = 'Usuário ou senha incorretos.';
          } else if (error.status === 0) {
            this.errorMessage = 'Erro de conexão. Verifique se o backend está rodando.';
          } else if (error.status >= 500) {
            this.errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
          } else {
            this.errorMessage = error.message || 'Erro ao fazer login. Tente novamente.';
          }
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength']) {
        if (fieldName === 'username') return 'Mínimo de 3 caracteres';
        return 'Mínimo de 6 caracteres';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
