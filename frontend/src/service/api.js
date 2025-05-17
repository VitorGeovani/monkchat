import axios from "axios";

// URL da API
const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export default class Api {
  // Método para buscar sala pelo nome e obter seu ID
  async obterIdSala(nomeSala) {
    try {
      // Primeiro listar todas as salas
      const salas = await this.listarSalas();

      // Verificar se há erro na resposta
      if (salas.erro) {
        return { erro: salas.erro };
      }

      // Buscar a sala pelo nome
      const sala = salas.find((s) => s.NM_SALA === nomeSala);

      if (sala) {
        return sala.ID_SALA;
      } else {
        // Se a sala não existe, tentamos criá-la
        const novaSala = await this.inserirSala(nomeSala);
        if (novaSala.erro) {
          return { erro: novaSala.erro };
        }
        return novaSala.id;
      }
    } catch (err) {
      console.error("Erro ao obter ID da sala:", err);
      return { erro: "Erro ao obter ID da sala" };
    }
  }

  // Método para listar mensagens
  async listarMensagens(idSala) {
    try {
      // Se idSala é uma string (nome da sala), buscar o ID numérico
      if (typeof idSala === "string" && isNaN(parseInt(idSala))) {
        const salaId = await this.obterIdSala(idSala);
        if (salaId.erro) return { erro: salaId.erro };
        idSala = salaId;
      }

      let r = await api.get(`/messages/room/${idSala}`);
      return r.data;
    } catch (err) {
      console.error("Erro ao listar mensagens:", err);
      return { erro: "Erro ao carregar mensagens" };
    }
  }

  // Método para inserir mensagens
  async inserirMensagem(
    nomeSala,
    nomeUsuario,
    mensagem,
    receiverId = null,
    receiverName = null
  ) {
    try {
      // Converter nome da sala para ID
      const salaId = await this.obterIdSala(nomeSala);
      if (salaId.erro) return { erro: salaId.erro };

      let resp = await api.post(`/messages`, {
        roomId: salaId,
        senderId: this.getUserId(),
        content: mensagem,
        receiverId: receiverId,
        receiverName: receiverName,
      });
      return resp.data;
    } catch (err) {
      console.error("Erro ao inserir mensagem:", err);
      return { erro: "Erro ao enviar mensagem" };
    }
  }

  // Método para registrar entrada na sala
  async registrarEntradaSala(nomeSala, nomeUsuario) {
    try {
      // Converter nome da sala para ID
      const salaId = await this.obterIdSala(nomeSala);
      if (salaId.erro) return { erro: salaId.erro };

      // Registrar entrada é similar a enviar uma mensagem com tipo "entrada"
      let resp = await api.post(`/messages`, {
        roomId: salaId,
        senderId: this.getUserId(),
        content: `${nomeUsuario} entrou na sala`,
        messageType: "entrada",
      });
      return resp.data;
    } catch (err) {
      console.error("Erro ao registrar entrada:", err);
      return { erro: "Erro ao registrar entrada na sala" };
    }
  }

  // Método para criar salas
  async inserirSala(sala) {
    try {
      let r = await api.post(`/rooms`, {
        name: sala,
        userId: this.getUserId(),
      });
      return r.data;
    } catch (err) {
      console.error("Erro ao inserir sala:", err);
      return { erro: "Erro ao criar sala" };
    }
  }

  // Método para adicionar participante na sala
  async adicionarParticipante(nomeSala, idUsuario) {
    try {
      // Converter nome da sala para ID
      const salaId = await this.obterIdSala(nomeSala);
      if (salaId.erro) return { erro: salaId.erro };

      let r = await api.post(`/rooms/participants`, {
        roomId: salaId,
        userId: idUsuario,
      });
      return r.data;
    } catch (err) {
      console.error("Erro ao adicionar participante:", err);
      return { erro: "Erro ao adicionar participante à sala" };
    }
  }

  // Método para listar usuários na sala
  async listarUsuariosSala(nomeSala) {
    try {
      // Converter nome da sala para ID
      const salaId = await this.obterIdSala(nomeSala);
      if (salaId.erro) return { erro: salaId.erro };

      let r = await api.get(`/rooms/${salaId}/participants`);
      return r.data;
    } catch (err) {
      console.error("Erro ao listar usuários da sala:", err);
      return { erro: "Erro ao carregar usuários da sala" };
    }
  }

  // Método auxiliar para obter ID do usuário logado
  getUserId() {
    const usuarioLogado = JSON.parse(
      localStorage.getItem("usuario-logado") || "{}"
    );
    return usuarioLogado.id_usuario || usuarioLogado.ID_USUARIO;
  }

  // Método para criar usuários
  async inserirUsuario(usuario) {
    try {
      let r = await api.post(`/users/register`, {
        name: usuario.nome,
        email: usuario.login,
        password: usuario.senha,
      });
      return r.data;
    } catch (err) {
      console.error("Erro ao inserir usuário:", err);
      if (err.response && err.response.data) {
        return err.response.data;
      }
      return { erro: "Erro ao cadastrar usuário" };
    }
  }

  // Método para atualizar usuário
  async atualizarUsuario(usuario) {
    try {
      let r = await api.put(`/users/${usuario.id}`, {
        name: usuario.nome,
      });
      return r.data;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return { erro: "Erro ao atualizar usuário" };
    }
  }

  // Método para login
  async login(login, senha) {
    try {
      let r = await api.post("/users/login", {
        email: login,
        password: senha,
      });
      return r.data.user;
    } catch (err) {
      console.error("Erro no login:", err);
      if (err.response) {
        return { erro: err.response.data.error || "Credenciais inválidas" };
      }
      return { erro: "Erro ao conectar com o servidor" };
    }
  }

  // Método para remover mensagens
  async removerMensagem(id) {
    try {
      let r = await api.delete(`/messages/${id}`);
      return r.data;
    } catch (err) {
      console.error("Erro ao remover mensagem:", err);
      return { erro: "Erro ao remover mensagem" };
    }
  }

  // Método para atualizar uma mensagem
  async atualizarMensagem(id, novaMensagem) {
    try {
      let r = await api.put(`/messages/${id}`, {
        content: novaMensagem,
      });
      return r.data;
    } catch (err) {
      console.error("Erro ao atualizar mensagem:", err);
      return { erro: "Erro ao atualizar mensagem" };
    }
  }

  // Método para redefinir senha
  async redefinirSenha(info) {
    try {
      const resp = await api.post("/users/reset-password", {
        id: info.id,
        currentPassword: info.senhaAtual,
        newPassword: info.novaSenha,
      });
      return resp.data;
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      if (err.response) {
        return err.response.data;
      }
      return { erro: "Ocorreu um erro na API" };
    }
  }

  // Método para listar salas
  async listarSalas() {
    try {
      let r = await api.get(`/rooms`);
      return r.data;
    } catch (err) {
      console.error("Erro ao listar salas:", err);
      return { erro: "Erro ao carregar lista de salas" };
    }
  }
}
