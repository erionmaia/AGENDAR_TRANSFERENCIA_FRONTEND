export const API_CONFIG = {
  // URLs base do backend
  BACKEND_URL: 'http://localhost:8080',
  
  // Endpoints de autenticação
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VALIDATE: '/api/auth/validate'
  },
  
  // Endpoints de transferências
  TRANSFERENCIAS: {
    BASE: '/api/transferencias',
    AGENDAR: '/api/transferencias/agendar',
    LISTAR: '/api/transferencias/listar',
    BUSCAR_POR_ID: '/api/transferencias/buscar',
    BUSCAR_POR_CONTA: '/api/transferencias/buscar-por-conta',
    BUSCAR_POR_PERIODO: '/api/transferencias/buscar-por-periodo',
    CANCELAR: '/api/transferencias/cancelar',
    CALCULAR_TAXA: '/api/transferencias/calcular-taxa'
  },
  
  // Endpoints de saúde
  HEALTH: {
    CHECK: '/api/health'
  },
  
  // Configurações de timeout
  TIMEOUT: {
    REQUEST: 30000, // 30 segundos
    REFRESH_TOKEN: 5000 // 5 segundos
  },
  
  // Headers padrão
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Configuração para diferentes ambientes
export const ENVIRONMENT = {
  DEVELOPMENT: {
    BACKEND_URL: 'http://localhost:8080',
    LOG_LEVEL: 'debug'
  },
  PRODUCTION: {
    BACKEND_URL: 'https://seu-backend-producao.com',
    LOG_LEVEL: 'error'
  }
};

// Função para obter a URL base baseada no ambiente
export function getBackendUrl(): string {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isDev ? ENVIRONMENT.DEVELOPMENT.BACKEND_URL : ENVIRONMENT.PRODUCTION.BACKEND_URL;
}
