import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout, tap } from 'rxjs/operators';
import { API_CONFIG, getBackendUrl } from '../config/api.config';

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly healthUrl = `${getBackendUrl()}/api/transferencias/health`;

  constructor(private http: HttpClient) {}

  // Verificar saúde do backend
  checkHealth(): Observable<HealthStatus> {
    console.log('Verificando saúde do backend em:', this.healthUrl);
    return this.http.get(this.healthUrl, { responseType: 'text' }).pipe(
      timeout(5000), // 5 segundos de timeout
      tap((response: any) => console.log('Resposta bruta do backend:', response)),
      map((response: any) => {
        console.log('Mapeando resposta:', response);
        
        // Se a resposta for uma string, tentar fazer parse como JSON
        let parsedResponse: any = response;
        if (typeof response === 'string') {
          try {
            parsedResponse = JSON.parse(response);
            console.log('Resposta parseada como JSON:', parsedResponse);
          } catch (e) {
            console.log('Resposta não é JSON válido, tratando como texto:', response);
            // Se não for JSON, mas o backend respondeu, considerar como UP
            return {
              status: 'UP' as const,
              timestamp: new Date().toISOString(),
              details: { rawResponse: response, parsed: false }
            };
          }
        }
        
        // Tentar diferentes formatos de resposta
        let status: 'UP' | 'DOWN' = 'DOWN';
        
        if (parsedResponse && typeof parsedResponse === 'object') {
          // Formato 1: { status: 'UP' }
          if (parsedResponse.status === 'UP' || parsedResponse.status === 'DOWN') {
            status = parsedResponse.status;
          }
          // Formato 2: { health: 'UP' }
          else if (parsedResponse.health === 'UP' || parsedResponse.health === 'DOWN') {
            status = parsedResponse.health;
          }
          // Formato 3: { state: 'UP' }
          else if (parsedResponse.state === 'UP' || parsedResponse.state === 'DOWN') {
            status = parsedResponse.state;
          }
          // Formato 4: Se a resposta existe e não é erro, considerar como UP
          else if (parsedResponse && !parsedResponse.error) {
            status = 'UP';
          }
        }
        
        console.log('Status determinado:', status);
        
        return {
          status,
          timestamp: parsedResponse?.timestamp || new Date().toISOString(),
          details: parsedResponse
        };
      }),
      catchError(error => {
        console.error('Erro ao verificar saúde do backend:', error);
        console.error('Tipo do erro:', typeof error);
        console.error('Status do erro:', error?.status);
        console.error('Mensagem do erro:', error?.message);
        
        // Se o erro for de parsing mas o status for 200, considerar como UP
        if (error.status === 200 && error.message?.includes('parsing')) {
          console.log('Backend respondeu com status 200, mas erro de parsing. Considerando como UP.');
          return of({
            status: 'UP' as const,
            timestamp: new Date().toISOString(),
            details: { error: 'Erro de parsing, mas backend respondeu', originalError: error }
          });
        }
        
        return of({
          status: 'DOWN' as const,
          timestamp: new Date().toISOString(),
          details: { error: 'Backend não está respondendo', originalError: error }
        });
      })
    );
  }

  // Verificar se o backend está online
  isBackendOnline(): Observable<boolean> {
    console.log('Verificando se o backend está online');
    return this.checkHealth().pipe(
      map(health => {
        console.log('Health status recebido:', health);
        const isOnline = health.status === 'UP';
        console.log('Backend online?', isOnline);
        return isOnline;
      })
    );
  }

  // Método de teste para debug
  testHealthEndpoint(): Observable<any> {
    console.log('Testando endpoint de saúde:', this.healthUrl);
    return this.http.get(this.healthUrl, { responseType: 'text' }).pipe(
      tap(response => console.log('Resposta bruta do endpoint:', response)),
      catchError(error => {
        console.error('Erro no teste do endpoint:', error);
        return of(null);
      })
    );
  }
}
