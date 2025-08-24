import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, timeout } from 'rxjs/operators';
import { Usuario, LoginRequest, LoginResponse, AuthState } from '../models/auth.model';
import { API_CONFIG, getBackendUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${getBackendUrl()}/api/auth`;
  private readonly storageKey = 'auth_data';
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    usuario: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarEstadoSalvo();
  }

  // Carregar estado salvo do localStorage
  private carregarEstadoSalvo(): void {
    try {
      const savedAuth = localStorage.getItem(this.storageKey);
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        this.authStateSubject.next({
          ...authData,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
      this.limparDados();
    }
  }

  // Salvar estado no localStorage
  private salvarEstado(authData: AuthState): void {
    try {
      const dataToSave = { ...authData, isLoading: false };
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erro ao salvar dados de autenticação:', error);
    }
  }

  // Login do usuário
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);
    
    console.log('🔐 Tentativa de login:', { username: credentials.username });
    
    const headers = new HttpHeaders(API_CONFIG.HEADERS);
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials, { headers }).pipe(
      timeout(API_CONFIG.TIMEOUT.REQUEST),
      tap(response => {
        console.log('✅ Login realizado com sucesso:', response.nomeCompleto);
        
        // Criar objeto Usuario a partir da resposta
        const usuario: Usuario = {
          id: response.id,
          username: response.username,
          email: response.email,
          nomeCompleto: response.nomeCompleto,
          roles: response.roles
        };
        
        const authState: AuthState = {
          usuario: usuario,
          token: response.token,
          isAuthenticated: true,
          isLoading: false
        };
        
        this.authStateSubject.next(authState);
        this.salvarEstado(authState);
      }),
      catchError((error: HttpErrorResponse) => {
        this.setLoading(false);
        console.error('❌ Erro no login:', error);
        return this.handleLoginError(error);
      })
    );
  }

  // Logout do usuário
  logout(): void {
    this.limparDados();
    // Opcional: chamar API de logout
    // this.http.post(`${this.baseUrl}/logout`, {}).subscribe();
  }

  // Limpar dados de autenticação
  private limparDados(): void {
    localStorage.removeItem(this.storageKey);
    this.authStateSubject.next({
      usuario: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  // Obter token atual
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  // Obter usuário atual
  getUsuario(): Usuario | null {
    return this.authStateSubject.value.usuario;
  }

  // Verificar se tem perfil específico
  hasPerfil(perfil: string): boolean {
    const usuario = this.getUsuario();
    return usuario ? usuario.roles.includes(perfil) : false;
  }

  // Verificar se é admin
  isAdmin(): boolean {
    return this.hasPerfil('ROLE_ADMIN');
  }

  // Verificar se é usuário comum
  isUser(): boolean {
    return this.hasPerfil('ROLE_USER');
  }

  // Verificar se tem perfil específico (por string)
  hasPerfilString(perfil: string): boolean {
    const usuario = this.getUsuario();
    return usuario ? usuario.roles.includes(perfil) : false;
  }

  // Atualizar token (refresh)
  refreshToken(): Observable<boolean> {
    const currentToken = this.getToken();
    if (!currentToken) {
      return of(false);
    }

    return this.http.post<{ token: string }>(`${this.baseUrl}/refresh`, { token: currentToken }).pipe(
      map(response => {
        const currentState = this.authStateSubject.value;
        const newState: AuthState = {
          ...currentState,
          token: response.token
        };
        
        this.authStateSubject.next(newState);
        this.salvarEstado(newState);
        return true;
      }),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }



  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({ ...currentState, isLoading: loading });
  }

  // Tratamento de erros de login
  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro ao fazer login. Tente novamente.';
    
    if (error.status === 401) {
      errorMessage = 'Usuário ou senha incorretos.';
    } else if (error.status === 0) {
      errorMessage = 'Erro de conexão. Verifique se o backend está rodando.';
    } else if (error.status >= 500) {
      errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    
    return throwError(() => ({ message: errorMessage, status: error.status }));
  }
}
