# 🔗 Integração Frontend-Backend

## 📋 **Visão Geral**

Este documento explica como integrar o frontend Angular com o backend Spring Boot.

## 🚀 **Configuração do Backend**

### **1. Endpoints Necessários**

#### **Autenticação (`/api/auth`)**
```http
POST /api/auth/login
{
  "username": "string",
  "senha": "string"
}

POST /api/auth/logout
POST /api/auth/refresh
GET /api/auth/validate
```

#### **Transferências (`/api/transferencias`)**
```http
POST /api/transferencias/agendar
GET /api/transferencias/listar
GET /api/transferencias/buscar/{id}
GET /api/transferencias/buscar-por-conta/{conta}
GET /api/transferencias/buscar-por-periodo
PUT /api/transferencias/cancelar/{id}
POST /api/transferencias/calcular-taxa
```

#### **Saúde (`/api/health`)**
```http
GET /api/health
```

### **2. Estrutura de Resposta**

#### **Login Response**
```json
{
  "usuario": {
    "id": 1,
    "username": "admin",
    "nome": "Administrador",
    "perfil": "ROLE_ADMIN",
    "ativo": true,
    "dataCriacao": "2024-01-01T00:00:00Z",
    "ultimoAcesso": "2024-01-01T00:00:00Z"
  },
  "token": "jwt-token-here",
  "refreshToken": "refresh-token-here",
  "expiraEm": "2024-01-02T00:00:00Z"
}
```

#### **Transferência**
```json
{
  "id": 1,
  "contaOrigem": "1234567890",
  "contaDestino": "0987654321",
  "valor": 1000.00,
  "taxa": 25.00,
  "valorTotal": 1025.00,
  "dataTransferencia": "2024-01-15T00:00:00Z",
  "dataAgendamento": "2024-01-01T00:00:00Z",
  "status": "AGENDADA"
}
```

## 🔧 **Configuração do Frontend**

### **1. Arquivo de Configuração**
```typescript
// src/app/config/api.config.ts
export const API_CONFIG = {
  BACKEND_URL: 'http://localhost:8080',
  // ... outras configurações
};
```

### **2. Variáveis de Ambiente**
```bash
# .env (opcional)
BACKEND_URL=http://localhost:8080
API_TIMEOUT=30000
```

### **3. CORS no Backend**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🧪 **Testando a Integração**

### **1. Verificar Backend**
```bash
# Testar endpoint de saúde
curl http://localhost:8080/api/health

# Testar endpoint de login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","senha":"admin123"}'
```

### **2. Verificar Frontend**
```bash
# Iniciar frontend
ng serve

# Verificar console do navegador
# Deve mostrar: "✅ Backend está online e respondendo."
```

### **3. Testar Login**
1. Acesse `http://localhost:4200`
2. Use credenciais: `admin` / `admin123`
3. Verifique se redireciona para home
4. Verifique se token é salvo no localStorage

## 🚨 **Tratamento de Erros**

### **1. Erros de Conexão**
- Backend offline
- Timeout de requisição
- Erro de CORS

### **2. Erros de Autenticação**
- Token inválido/expirado
- Credenciais incorretas
- Sessão expirada

### **3. Erros de Validação**
- Dados inválidos
- Campos obrigatórios
- Formato incorreto

## 🔒 **Segurança**

### **1. JWT Token**
- Armazenado no localStorage
- Enviado em header Authorization
- Refresh automático (implementar)

### **2. CORS**
- Apenas origem permitida
- Métodos HTTP restritos
- Headers controlados

### **3. Validação**
- Frontend e backend
- Sanitização de dados
- Rate limiting

## 📱 **Monitoramento**

### **1. Logs do Frontend**
```typescript
console.log('✅ Backend online');
console.warn('⚠️ Backend offline');
console.error('❌ Erro na API');
```

### **2. Logs do Backend**
```java
@Slf4j
public class AuthController {
    log.info("Login attempt for user: {}", username);
    log.error("Authentication failed: {}", error);
}
```

### **3. Health Check**
- Verificação automática
- Status em tempo real
- Notificações de erro

## 🚀 **Deploy**

### **1. Desenvolvimento**
```bash
# Backend
./mvnw spring-boot:run

# Frontend
ng serve
```

### **2. Produção**
```bash
# Backend
./mvnw clean package
java -jar target/app.jar

# Frontend
ng build --configuration production
```

## 📚 **Recursos Adicionais**

- [Angular HTTP Client](https://angular.io/guide/http)
- [Spring Boot CORS](https://spring.io/guides/gs/rest-service-cors/)
- [JWT Authentication](https://jwt.io/)
- [HTTP Status Codes](https://httpstatuses.com/)

## 🆘 **Solução de Problemas**

### **Problema: CORS Error**
```bash
# Solução: Configurar CORS no backend
# Ver seção "CORS no Backend"
```

### **Problema: 401 Unauthorized**
```bash
# Solução: Verificar token JWT
# Verificar se está sendo enviado
# Verificar se não expirou
```

### **Problema: Backend não responde**
```bash
# Solução: Verificar se está rodando
# Verificar porta 8080
# Verificar logs do Spring Boot
```
