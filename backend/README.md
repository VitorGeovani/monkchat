# MonkChat Backend

<div align="center">
   <img src="https://raw.githubusercontent.com/seu-usuario/monkchat/main/assets/images/logo-monkchat.png" alt="MonkChat Logo" width="120" />
   <h3>Uma aplicação de chat completa e moderna</h3>
</div>

MonkChat é uma aplicação de chat em tempo real que permite a criação de salas, envio de mensagens públicas ou privadas, e gerenciamento completo de usuários. Este repositório contém o código backend da aplicação, desenvolvido em Node.js com Express e MySQL.

## 📋 Índice
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Configuração](#-instalação-e-configuração)
- [API Endpoints](#-api-endpoints)
- [Modelos de Dados](#-modelos-de-dados)
- [Funcionalidades](#-funcionalidades)
- [Como Contribuir](#-como-contribuir)

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework para criação de APIs RESTful
- **MySQL**: Banco de dados relacional
- **dotenv**: Gestão de variáveis de ambiente
- **cors**: Configuração de políticas de compartilhamento entre origens
- **nodemon**: Desenvolvimento com recarga automática do servidor

## 📁 Estrutura do Projeto

```
backend/
├── .env                     # Variáveis de ambiente
├── .gitignore               # Configurações de exclusão para Git
├── package.json             # Dependências e scripts do projeto
├── README.md                # Documentação do projeto
└── src/
      ├── app.js               # Configuração do Express
      ├── db.js                # Conexão com o banco de dados MySQL
      ├── server.js            # Inicialização do servidor
      ├── controllers/         # Controladores de lógica de negócios
      │   ├── MessageController.js    # Gerenciamento de mensagens
      │   ├── ParticipantController.js # Gerenciamento de participantes
      │   ├── RoomController.js       # Gerenciamento de salas
      │   └── UserController.js       # Gerenciamento de usuários
      ├── repositories/        # Acesso ao banco de dados
      │   ├── MessageRepository.js
      │   ├── ParticipantRepository.js
      │   ├── RoomRepository.js
      │   └── UserRepository.js
      └── routes/              # Definição de rotas da API
            ├── index.js         # Agrupamento de rotas
            ├── messageRoutes.js # Rotas para mensagens
            ├── roomRoutes.js    # Rotas para salas
            └── userRoutes.js    # Rotas para usuários
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 14.x ou superior
- MySQL 5.7 ou superior

### Passos de Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/monkchat.git
    cd monkchat/backend
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:
    ```
    DB_HOST=localhost
    DB_USER=seu_usuario
    DB_PASSWORD=sua_senha
    DB_DATABASE=chat_db
    DB_CONNECTION_LIMIT=10
    PORT=3001
    ```

4. Crie o banco de dados e as tabelas necessárias:
    ```sql
    CREATE DATABASE chat_db;
    USE chat_db;
    
    -- Tabela de usuários
    CREATE TABLE TB_USUARIO (
       ID_USUARIO INT PRIMARY KEY AUTO_INCREMENT,
       NM_USUARIO VARCHAR(100) NOT NULL,
       DS_EMAIL VARCHAR(200) UNIQUE NOT NULL,
       DS_SENHA VARCHAR(100) NOT NULL
    );
    
    -- Tabela de salas
    CREATE TABLE TB_SALA (
       ID_SALA INT PRIMARY KEY AUTO_INCREMENT,
       ID_USUARIO INT,
       NM_SALA VARCHAR(100) UNIQUE NOT NULL,
       FOREIGN KEY (ID_USUARIO) REFERENCES TB_USUARIO(ID_USUARIO)
    );
    
    -- Tabela de participantes
    CREATE TABLE TB_PARTICIPANTE (
       ID_PARTICIPANTE INT PRIMARY KEY AUTO_INCREMENT,
       ID_SALA INT,
       ID_USUARIO INT,
       UNIQUE KEY (ID_SALA, ID_USUARIO),
       FOREIGN KEY (ID_SALA) REFERENCES TB_SALA(ID_SALA),
       FOREIGN KEY (ID_USUARIO) REFERENCES TB_USUARIO(ID_USUARIO)
    );
    
    -- Tabela de mensagens
    CREATE TABLE TB_MENSAGEM (
       ID_MENSAGEM INT PRIMARY KEY AUTO_INCREMENT,
       ID_SALA INT,
       ID_USUARIO_ENVIO INT,
       ID_USUARIO_PARA INT NULL,
       NM_USUARIO_PARA VARCHAR(100) NULL,
       DS_MENSAGEM TEXT NOT NULL,
       DT_MENSAGEM TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       TP_MENSAGEM VARCHAR(20) DEFAULT 'mensagem',
       FOREIGN KEY (ID_SALA) REFERENCES TB_SALA(ID_SALA),
       FOREIGN KEY (ID_USUARIO_ENVIO) REFERENCES TB_USUARIO(ID_USUARIO),
       FOREIGN KEY (ID_USUARIO_PARA) REFERENCES TB_USUARIO(ID_USUARIO)
    );
    ```

5. Inicie o servidor:
    ```bash
    npm start
    ```

6. Para desenvolvimento com recarga automática (nodemon):
    ```bash
    npm run dev
    ```

## 📡 API Endpoints

### Autenticação e Usuários
- `POST /api/users/register` - Cadastra um novo usuário
   - Body: `{ "name": "Nome", "email": "email@example.com", "password": "senha123" }`

- `POST /api/users/login` - Realiza login
   - Body: `{ "email": "email@example.com", "password": "senha123" }`

- `GET /api/users` - Lista todos os usuários
   
- `PUT /api/users/:id` - Atualiza um usuário
   - Body: `{ "name": "Novo Nome" }`

- `POST /api/users/reset-password` - Redefine a senha de um usuário
   - Body: `{ "id": 1, "currentPassword": "senha-atual", "newPassword": "nova-senha" }`

### Salas
- `POST /api/rooms` - Cria uma nova sala
   - Body: `{ "name": "Nome da Sala", "userId": 1 }`

- `GET /api/rooms` - Lista todas as salas

- `GET /api/rooms/:id` - Obtém detalhes de uma sala específica

- `GET /api/rooms/user/:userId` - Lista salas de um usuário

### Participantes
- `POST /api/rooms/participants` - Adiciona um participante a uma sala
   - Body: `{ "roomId": 1, "userId": 1 }`

- `DELETE /api/rooms/participants/:roomId/:userId` - Remove participante de uma sala

- `GET /api/rooms/:roomId/participants` - Lista participantes de uma sala

### Mensagens
- `POST /api/messages` - Envia uma mensagem
   - Body: `{ "senderId": 1, "roomId": 1, "content": "Texto da mensagem", "receiverId": null }`

- `GET /api/messages/room/:roomId` - Lista mensagens de uma sala

- `GET /api/messages/direct/:senderId/:receiverId` - Lista mensagens diretas entre dois usuários

- `PUT /api/messages/:id` - Atualiza uma mensagem
   - Body: `{ "content": "Novo texto da mensagem" }`

- `DELETE /api/messages/:id` - Remove uma mensagem

## 📊 Modelos de Dados

### Usuário
```javascript
{
   ID_USUARIO: Number,        // Identificador único do usuário
   NM_USUARIO: String,        // Nome/apelido do usuário
   DS_EMAIL: String,          // Email (usado para login)
   DS_SENHA: String           // Senha de acesso
}
```

### Sala
```javascript
{
   ID_SALA: Number,           // Identificador único da sala
   ID_USUARIO: Number,        // Identificador do criador da sala
   NM_SALA: String            // Nome da sala
}
```

### Participante
```javascript
{
   ID_PARTICIPANTE: Number,   // Identificador único da participação
   ID_SALA: Number,           // Identificador da sala
   ID_USUARIO: Number         // Identificador do usuário participante
}
```

### Mensagem
```javascript
{
   ID_MENSAGEM: Number,       // Identificador único da mensagem
   ID_SALA: Number,           // Sala onde a mensagem foi enviada
   ID_USUARIO_ENVIO: Number,  // Usuário que enviou a mensagem
   ID_USUARIO_PARA: Number,   // Destinatário (null para todos)
   NM_USUARIO_PARA: String,   // Nome do destinatário (opcional)
   DS_MENSAGEM: String,       // Conteúdo da mensagem
   DT_MENSAGEM: Date,         // Data e hora do envio
   TP_MENSAGEM: String        // Tipo da mensagem (mensagem, entrada)
}
```

## 🔥 Funcionalidades

### Gerenciamento de Usuários
- Cadastro de usuários com validação de emails únicos
- Sistema de login com validação de credenciais
- Atualização de perfil (nome de usuário)
- Redefinição de senha com verificação de senha atual

### Gerenciamento de Salas
- Criação de salas com nomes únicos
- Listagem de salas disponíveis
- Busca de salas por usuário
- Detalhe de sala com participantes

### Sistema de Participantes
- Adição de usuários às salas
- Verificação para evitar duplicação de participantes
- Remoção de participantes
- Listagem de participantes por sala

### Sistema de Mensagens
- Envio de mensagens em salas
- Mensagens públicas (para todos) e privadas (para usuário específico)
- Registro automático de entrada em salas
- Edição de mensagens enviadas
- Remoção de mensagens

## 📈 Desenvolvimento

### Scripts do projeto
- `npm start`: Inicia o servidor usando o Node.js
- `npm run dev`: Inicia o servidor em modo de desenvolvimento com Nodemon

### Estrutura de Arquitetura MVC
O projeto segue uma estrutura MVC adaptada:
- **Controllers**: Gerenciam requisições HTTP e resposta aos clientes
- **Repositories**: Encapsulam lógica de acesso ao banco de dados
- **Routes**: Definem endpoints da API e direcionam para controladores

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: Minha nova feature'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License.