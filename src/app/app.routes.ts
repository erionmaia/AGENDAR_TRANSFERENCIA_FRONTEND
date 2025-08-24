import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AgendarTransferencia } from './components/agendar-transferencia/agendar-transferencia';
import { Extrato } from './components/extrato/extrato';
import { CalcularTaxa } from './components/calcular-taxa/calcular-taxa';
import { Login } from './components/login/login';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { 
    path: '', 
    component: Home, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'agendar', 
    component: AgendarTransferencia, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'extrato', 
    component: Extrato, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'calcular-taxa', 
    component: CalcularTaxa, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '' }
];
