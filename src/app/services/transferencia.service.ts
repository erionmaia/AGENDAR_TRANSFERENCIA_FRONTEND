import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Transferencia, CalculoTaxa, TransferenciaRequest } from '../models/transferencia.model';
import { API_CONFIG, getBackendUrl } from '../config/api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {
  private readonly baseUrl = `${getBackendUrl()}/api/transferencias`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Obter headers com token de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      ...API_CONFIG.HEADERS,
      'Authorization': `Bearer ${token}`
    });
  }

  // Tratamento de erros HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro na operação. Tente novamente.';
    
    if (error.status === 401) {
      errorMessage = 'Sessão expirada. Faça login novamente.';
      this.authService.logout();
    } else if (error.status === 0) {
      errorMessage = 'Erro de conexão. Verifique se o backend está rodando.';
    } else if (error.status >= 500) {
      errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    
    return throwError(() => ({ message: errorMessage, status: error.status }));
  }

  // Agendar uma nova transferência
  agendarTransferencia(transferencia: TransferenciaRequest): Observable<Transferencia> {
    return this.http.post<Transferencia>(this.baseUrl, transferencia);
  }

  // Listar todas as transferências
  listarTransferencias(): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(this.baseUrl);
  }

  // Buscar transferência por ID
  buscarPorId(id: number): Observable<Transferencia> {
    return this.http.get<Transferencia>(`${this.baseUrl}/${id}`);
  }

  // Buscar por conta de origem
  buscarPorContaOrigem(contaOrigem: string): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(`${this.baseUrl}/origem/${contaOrigem}`);
  }

  // Buscar por conta de destino
  buscarPorContaDestino(contaDestino: string): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(`${this.baseUrl}/destino/${contaDestino}`);
  }

  // Buscar por período
  buscarPorPeriodo(dataInicio: string, dataFim: string): Observable<Transferencia[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<Transferencia[]>(`${this.baseUrl}/periodo`, { params });
  }

  // Cancelar transferência
  cancelarTransferencia(id: number): Observable<Transferencia> {
    return this.http.put<Transferencia>(`${this.baseUrl}/${id}/cancelar`, {});
  }

  // Calcular taxa
  calcularTaxa(valor: number, dataTransferencia: string): Observable<CalculoTaxa> {
    const params = new HttpParams()
      .set('valor', valor.toString())
      .set('dataTransferencia', dataTransferencia);
    return this.http.get<CalculoTaxa>(`${this.baseUrl}/calcular-taxa`, { params });
  }

  // Health check
  healthCheck(): Observable<string> {
    return this.http.get(`${this.baseUrl}/health`, { responseType: 'text' });
  }
}
