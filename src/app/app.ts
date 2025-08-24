import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavMenu } from './components/nav-menu/nav-menu';
import { UtilService } from './services/util.service';
import { AuthService } from './services/auth.service';
import { HealthService } from './services/health.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'transferencia-frontend';
  
  constructor(
    public utilService: UtilService,
    public authService: AuthService,
    private router: Router,
    private healthService: HealthService
  ) {}
  
  ngOnInit(): void {
    // Verificar saúde do backend
    this.checkBackendHealth();
    
    // Se não estiver autenticado e não estiver na página de login, redirecionar
    if (!this.authService.isAuthenticated() && this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  private checkBackendHealth(): void {
    // Primeiro testar o endpoint diretamente
    this.healthService.testHealthEndpoint().subscribe(response => {
      console.log('Teste direto do endpoint:', response);
    });

    // Depois verificar o status
    this.healthService.isBackendOnline().subscribe(isOnline => {
      if (!isOnline) {
        console.warn('⚠️ Backend não está respondendo. Verifique se está rodando.');
      } else {
        console.log('✅ Backend está online e respondendo.');
      }
    });
  }
}
