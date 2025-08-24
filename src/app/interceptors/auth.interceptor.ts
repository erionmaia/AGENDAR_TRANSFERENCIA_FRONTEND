import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Não interceptar requisições de health
  if (request.url.includes('/health')) {
    console.log('Pulando interceptor para health check');
    return next(request);
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  // Adicionar token se disponível
  const token = authService.getToken();
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado ou inválido
        authService.logout();
        router.navigate(['/login']);
        return throwError(() => ({ message: 'Sessão expirada. Faça login novamente.', status: 401 }));
      }
      
      return throwError(() => error);
    })
  );
};
