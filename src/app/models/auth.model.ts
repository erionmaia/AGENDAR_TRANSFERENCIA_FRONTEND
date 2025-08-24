export interface Usuario {
  id: number;
  username: string;
  email: string;
  nomeCompleto: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  id: number;
  username: string;
  email: string;
  nomeCompleto: string;
  roles: string[];
  mensagem: string;
  sucesso: boolean;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
