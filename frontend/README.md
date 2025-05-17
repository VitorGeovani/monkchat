# MonkChat

<div align="center">
   <img src="/public/assets/images/logo-monkchat.png" alt="MonkChat Logo" width="150" />
   <h3>Uma aplicação de chat em tempo real moderna e intuitiva</h3>
</div>

## 📋 Visão Geral
MonkChat é uma aplicação web de mensagens em tempo real que permite aos usuários criar salas, enviar mensagens públicas ou privadas, editar mensagens enviadas, e gerenciar suas contas de usuário. Este repositório contém o código frontend da aplicação, desenvolvido com React e tecnologias modernas.

## 🚀 Tecnologias Utilizadas
- **React 19.1.0**: Biblioteca JavaScript para construção da interface com o mais recente sistema de renderização e hooks
- **React Router 7.6.0**: Gerenciamento avançado de navegação e rotas com recursos de memorização e lazy loading
- **CSS Modular**: Estilização com CSS puro organizado em módulos por componente
- **React Toastify 11.0.5**: Sistema completo de notificações toast personalizadas
- **React Top Loading Bar 3.0.2**: Indicadores de carregamento superiores para melhor UX
- **Axios 1.9.0**: Cliente HTTP robusto para comunicação com o backend
- **Styled Components 6.1.18**: Biblioteca para estilização de componentes (parcialmente migrada para CSS puro)

## 🔍 Principais Funcionalidades

### Autenticação e Gerenciamento de Usuários
- **Sistema completo de login**: Autenticação com email/senha e armazenamento seguro em localStorage
- **Cadastro intuitivo**: Registro de novos usuários com validações em tempo real
- **Perfil de usuário**: Alteração de nickname e redefinição de senha com confirmação
- **Sessões de usuário**: Gerenciamento de sessões com logout seguro

### Chat Avançado
- **Criação e gestão de salas**: Interface para criar salas de chat com nomes personalizados
- **Sistema de participantes**: Visualização de usuários online em cada sala
- **Mensagens públicas e privadas**: Envio de mensagens para todos ou para usuários específicos
- **Edição inline de mensagens**: Possibilidade de editar mensagens enviadas com indicador visual
- **Notificações de entrada**: Avisos automáticos quando usuários entram nas salas
- **Histórico completo**: Carregamento e visualização do histórico de conversas
- **Atualização automática**: Polling otimizado para atualização de novas mensagens (a cada 5 segundos)

### Interface Responsiva
- **Design adaptativo**: Layout responsivo para dispositivos desktop, tablet e mobile
- **Sistema de notificações**: Toasts para feedback de ações bem-sucedidas e erros
- **Indicadores de carregamento**: Barras de progresso para operações assíncronas
- **Animações e transições**: Feedback visual para interações do usuário
- **Modo de edição contextual**: Interface intuitiva para edição de mensagens

## 📁 Estrutura do Projeto

```
monkchat/frontend/
├── public/                      # Arquivos públicos
│   ├── assets/
│   │   └── images/              # Imagens e ícones
│   ├── index.html               # HTML principal
│   ├── manifest.json            # Manifesto da aplicação web
│   └── robots.txt               # Configurações para crawlers
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── cabecalho/           # Componente de navegação superior
│   │   └── outros/              # Componentes UI compartilhados
│   ├── pages/                   # Páginas da aplicação
│   │   ├── alterar/             # Alteração de perfil e senha
│   │   ├── cadastro/            # Registro de usuários
│   │   ├── login/               # Autenticação de usuários
│   │   └── monkchat/            # Interface principal do chat
│   ├── service/
│   │   └── api.js               # Integração com backend via Axios
│   ├── index.css                # Estilos globais
│   ├── index.js                 # Ponto de entrada da aplicação
│   └── routes.js                # Configuração de rotas
└── package.json                 # Dependências e scripts
```

## 💻 Detalhes de Implementação

### Sistema de Autenticação
- **Armazenamento seguro**: Dados de usuário persistidos em localStorage com controle de sessão
- **Proteção de rotas**: Redirecionamento automático para tela de login quando não autenticado
- **Validações robustas**: Verificação de campos obrigatórios e formatos de entrada
- **Feedback de erros**: Mensagens específicas para problemas de autenticação

### Gerenciamento de Estado
- **Hooks modernos**: Uso extensivo de `useState`, `useEffect`, `useRef` e `useCallback`
- **Estados locais eficientes**: Gerenciamento otimizado de componentes
- **Referências persistentes**: Uso de `useRef` para elementos DOM e intervalos
- **Efeitos controlados**: Limpeza adequada de efeitos para evitar memory leaks

### Interface do Chat
- **Layout flexível**: Visualização adaptada para diferentes dispositivos
- **Sistema de rolagem inteligente**: Rolagem automática para novas mensagens com detecção de posição
- **Edição contextual**: Interface inline para edição de mensagens próprias
- **Indicadores visuais**: Feedback claro para mensagens próprias e de outros usuários
- **Filtro de mensagens**: Visualização seletiva de mensagens públicas e privadas
- **Formatação de data/hora**: Exibição amigável de carimbos de tempo

### Otimizações de Performance
- **Memoização de funções**: Uso de `useCallback` para evitar rerenderizações desnecessárias
- **Debouncing de eventos**: Controle de frequência de atualizações do chat
- **Renderização condicional**: Componentes carregados apenas quando necessário
- **Carregamento eficiente**: Limitação de mensagens carregadas por requisição

## 🛠️ Como Iniciar o Desenvolvimento

### Pré-requisitos
- Node.js 14.x ou superior
- NPM 6.x ou superior ou Yarn 1.22.x ou superior
- Conexão com internet (para instalar as dependências)

### Instalação
1. Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/MonkChat.git
    cd MonkChat/frontend
    ```

2. Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```

3. Configure o ambiente:
    - Verifique se o backend está em execução na porta correta (padrão: 3001)
    - Ajuste a URL da API em `src/service/api.js` se necessário

4. Inicie o servidor de desenvolvimento:
    ```bash
    npm start
    # ou
    yarn start
    ```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Scripts Disponíveis
- `npm start` - Inicia o servidor de desenvolvimento
- `npm test` - Executa os testes automatizados
- `npm run build` - Gera a versão de produção na pasta `build/`
- `npm run eject` - Ejeta as configurações do Create React App (não recomendado)

## 🔌 Integração com Backend

O frontend se comunica com uma API RESTful desenvolvida em Node.js/Express através do arquivo `api.js`, que encapsula:

### Endpoints de Usuários
- **Login**: Autenticação de usuários com email/senha
- **Cadastro**: Criação de novos usuários
- **Atualização**: Modificação de perfil (nickname)
- **Redefinição de senha**: Alteração segura de senhas

### Endpoints de Salas
- **Criação**: Novas salas de chat com nome único
- **Listagem**: Recuperação de salas disponíveis
- **Participantes**: Adição e remoção de usuários em salas

### Endpoints de Mensagens
- **Envio**: Publicação de mensagens em salas
- **Listagem**: Recuperação de histórico de mensagens
- **Edição**: Atualização de mensagens enviadas
- **Exclusão**: Remoção de mensagens (quando implementado)

### Tratamento de Erros
- **Respostas HTTP**: Processamento adequado de códigos de status
- **Respostas de erro**: Exibição de mensagens amigáveis para problemas de API
- **Tratamento de exceções**: Captura e exibição de erros inesperados

## 📱 Responsividade

A aplicação foi projetada para funcionar bem em diferentes dispositivos:

- **Desktop**: Layout completo com todas as funcionalidades visíveis
- **Tablet**: Adaptação de elementos para telas médias
- **Mobile**: Reorganização do layout para telas pequenas
   - Formulário de chat e área de mensagens em orientação vertical
   - Botões e controles redimensionados para toque
   - Interface simplificada para melhor usabilidade em dispositivos móveis

## 🚀 Processo de Deploy

### Gerando a versão de produção
```bash
npm run build
# ou
yarn build
```

### Ambientes de hospedagem recomendados
- **Netlify**: Integração contínua com GitHub e deploy automático
- **Vercel**: Otimizado para aplicações React com preview de branches
- **GitHub Pages**: Hospedagem gratuita para projetos de código aberto
- **AWS S3 + CloudFront**: Solução escalável com CDN integrado
- **Firebase Hosting**: Fácil configuração e integração com outros serviços Firebase

### Configuração de produção
1. Ajuste variáveis de ambiente para apontar para a API de produção
2. Otimize imagens e outros assets estáticos
3. Configure regras de cache adequadas
4. Implemente monitoramento de erros (ex: Sentry)

## 🤝 Contribuição

Contribuições são muito bem-vindas! Para contribuir:

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Faça **commit** das alterações: `git commit -m 'feat: Adiciona nova funcionalidade'`
4. Envie para o GitHub: `git push origin feature/nova-funcionalidade`
5. Abra um **Pull Request**

### Boas práticas
- Siga o padrão de commits convencionais (feat, fix, docs, style, refactor, etc.)
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Verifique se o código passa nos linters antes de enviar

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev/) - Documentação oficial do React
- [React Router Documentation](https://reactrouter.com/) - Guia de navegação
- [Axios Documentation](https://axios-http.com/) - Cliente HTTP
- [React Toastify Documentation](https://fkhadra.github.io/react-toastify) - Sistema de notificações

## 📝 Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
   <p><i>Desenvolvido com 💜 pelo grupo Esquemas d@ Bolívi@</i></p>
</div>