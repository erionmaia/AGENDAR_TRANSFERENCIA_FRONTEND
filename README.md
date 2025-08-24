# Sistema de Agendamento de Transferências Financeiras - Frontend

Frontend desenvolvido em **Angular** para o sistema de agendamento de transferências financeiras, integrando com a API Spring Boot do backend.
Desenvolvido exclusivamente como desafio técnico para a GlobalTI.

## Tecnologias Utilizadas

- **Angular 20** - Framework para aplicações web
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS
- **Angular Material** - Componentes de UI
- **Angular Forms** - Formulários reativos
- **Angular Router** - Roteamento da aplicação
- **Angular HttpClient** - Comunicação com API REST

## Arquitetura do Sistema

### Padrões Arquiteturais
- **Arquitetura em Componentes** (Component-based architecture)
- **Padrão de Serviços** para lógica de negócio
- **Padrão de Modelos** para tipagem de dados
- **Formulários Reativos** para validação de entrada
- **Injeção de Dependência** para gerenciamento de serviços

### Estrutura do Projeto
```
src/
├── app/
│   ├── components/           # Componentes da aplicação
│   │   ├── home/            # Página inicial
│   │   ├── nav-menu/        # Menu de navegação
│   │   ├── agendar-transferencia/  # Formulário de agendamento
│   │   ├── extrato/         # Lista de transferências
│   │   └── calcular-taxa/   # Calculadora de taxas
│   ├── models/              # Interfaces e tipos TypeScript
│   ├── services/            # Serviços para comunicação com API
│   ├── app.routes.ts        # Configuração de rotas
│   ├── app.config.ts        # Configuração da aplicação
│   └── app.ts               # Componente principal
├── assets/                  # Recursos estáticos
└── styles.scss              # Estilos globais
```

## Funcionalidades Implementadas

### 1. Página Inicial
- Apresentação do sistema
- Cards informativos sobre funcionalidades
- Tabela de referência de taxas
- Ações rápidas para navegação

### 2. Agendamento de Transferências
- Formulário com validações
- Cálculo automático de taxas
- Validação de datas (máximo 50 dias)
- Formatação de contas (XXXXXXXXXX)
- Feedback visual de erros e sucesso

### 3. Extrato de Transferências
- Lista completa de transferências
- Filtros por conta origem/destino
- Filtros por período de datas
- Estatísticas em tempo real
- Modal de detalhes
- Funcionalidade de cancelamento

### 4. Calculadora de Taxas
- Cálculo independente de taxas
- Tabela de referência completa
- Validação de regras de negócio
- Informações detalhadas sobre taxas

### 5. Navegação
- Menu responsivo
- Navegação entre páginas
- Indicadores de página ativa
- Design mobile-first

## Integração com Backend

### Endpoints Utilizados
- `POST /api/transferencias` - Agendar transferência
- `GET /api/transferencias` - Listar transferências
- `GET /api/transferencias/calcular-taxa` - Calcular taxa
- `PUT /api/transferencias/{id}/cancelar` - Cancelar transferência
- `GET /api/transferencias/origem/{conta}` - Buscar por conta origem
- `GET /api/transferencias/destino/{conta}` - Buscar por conta destino
- `GET /api/transferencias/periodo` - Buscar por período

### Modelos de Dados
```typescript
interface Transferencia {
  id?: number;
  contaOrigem: string;
  contaDestino: string;
  valor: number;
  taxa: number;
  valorTotal?: number;
  dataTransferencia: string;
  dataAgendamento?: string;
  dataCriacao?: string;
  status?: StatusTransferencia;
  diasParaTransferencia?: number;
}

interface CalculoTaxa {
  valor: number;
  dataTransferencia: string;
  diasParaTransferencia: number;
  taxa: number;
  valorTotal: number;
  mensagem: string;
  sucesso: boolean;
}
```

## Design e UX

### Características do Design
- **Design System Consistente** com cores e tipografia padronizadas
- **Interface Responsiva** para todos os dispositivos
- **Feedback Visual** para ações do usuário
- **Validações em Tempo Real** com mensagens claras
- **Animações Suaves** para melhor experiência
- **Ícones Intuitivos** para facilitar a navegação

### Paleta de Cores
- **Primária**: #667eea (Azul)
- **Secundária**: #764ba2 (Roxo)
- **Sucesso**: #28a745 (Verde)
- **Erro**: #dc3545 (Vermelho)
- **Aviso**: #ffc107 (Amarelo)
- **Neutro**: #6c757d (Cinza)

## Instalação e Execução

### Pré-requisitos
- **Node.js 20** ou superior
- **npm** ou **yarn**
- **Angular CLI** (instalado globalmente)

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd transferencia-frontend
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Backend
Certifique-se de que o backend Spring Boot esteja rodando em:
- **URL**: `http://localhost:8080`
- **Context Path**: `/api`

### 4. Executar em Desenvolvimento
```bash
ng serve
```
A aplicação estará disponível em: `http://localhost:4200`

### 5. Build de Produção
```bash
ng build --configuration production
```

## Responsividade

### Breakpoints Implementados
- **Desktop**: > 1200px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px

### Adaptações Mobile
- Menu de navegação responsivo
- Formulários otimizados para touch
- Tabelas com scroll horizontal
- Botões com tamanhos adequados
- Espaçamentos ajustados

## Testes

### Executar Testes
```bash
# Testes unitários
ng test

# Testes e2e
ng e2e

# Cobertura de testes
ng test --code-coverage
```

## Deploy

### Build de Produção
```bash
ng build --configuration production
```

### Arquivos de Saída
Os arquivos compilados estarão em `dist/transferencia-frontend/`

### Servidor Web
- **Nginx** (recomendado)
- **Apache**
- **Servidor estático** (Node.js, Python, etc.)

## Configurações

### Variáveis de Ambiente
```typescript
// src/app/services/transferencia.service.ts
private readonly baseUrl = 'http://localhost:8080/api/transferencias';
```

### Configurações de Build
```json
// angular.json
{
  "configurations": {
    "production": {
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    }
  }
}
```

## Performance

### Otimizações Implementadas
- **Lazy Loading** de componentes
- **OnPush Change Detection** para componentes
- **TrackBy Functions** para listas
- **Unsubscribe** automático de observables
- **Compressão** de assets
- **Minificação** de código

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Segurança

### Validações Implementadas
- **Validação de Formulários** no frontend
- **Sanitização** de entrada do usuário
- **Validação de Tipos** com TypeScript
- **CORS** configurado no backend
- **HTTPS** recomendado para produção

## Logs e Monitoramento

### Console Logs
- Logs de erro para debugging
- Logs de sucesso para auditoria
- Logs de validação para UX

### Tratamento de Erros
- **Global Error Handler** para erros não tratados
- **User-friendly Messages** para erros de API
- **Fallback UI** para estados de erro
- **Retry Mechanisms** para falhas temporárias

## Autores

- **Erion Maia** - [erionmaia@gmail.com](mailto:erionmaia@gmail.com)

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2024  
**Status**: ✅ Produção  
**Angular**: 20.2.0  
**Node.js**: 22.18.0
