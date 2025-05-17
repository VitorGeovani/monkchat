import axios from "axios";

// URL da API
const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export default class Api {
  // Método para listar mensagens
  async listarMensagens(idSala) {
    let r = await api.get(`/chat/${idSala}`);
    return r.data;
  }

  // Método para inserir mensagens
  async inserirMensagem(
    nomeSala,
    nomeUsuario,
    mensagem,
    receiverId = null,
    receiverName = null
  ) {
    let resp = await api.post(`/chat`, {
      sala: nomeSala,
      usuario: nomeUsuario,
      mensagem: mensagem,
      para: receiverId,
      para_nome: receiverName,
    });
    return resp.data;
  }

  // Método para registrar entrada na sala
  async registrarEntradaSala(nomeSala, nomeUsuario) {
    let resp = await api.post(`/chat/entrada`, {
      sala: nomeSala,
      usuario: nomeUsuario,
    });
    return resp.data;
  }

  // Método para criar salas
  async inserirSala(sala) {
    let r = await api.post(`/sala`, {
      nome: sala,
    });
    return r.data;
  }

  // Método para adicionar participante na sala
  async adicionarParticipante(sala, idUsuario) {
    let r = await api.post(`/sala/participante`, {
      sala: sala,
      idUsuario: idUsuario,
    });
    return r.data;
  }

  // Método para listar usuários na sala
  async listarUsuariosSala(nomeSala) {
    let r = await api.get(`/sala/participantes/${nomeSala}`);
    return r.data;
  }

  // Método para criar usuários
  async inserirUsuario(usuario) {
    let r = await api.post(`/users/register`, {
      name: usuario.nome,
      email: usuario.login,
      password: usuario.senha,
    });
    return r.data;
  }

  // Método para atualizar usuário
  async atualizarUsuario(usuario) {
    let r = await api.put(`/users/${usuario.id}`, {
      name: usuario.nome,
    });
    return r.data;
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
    let r = await api.delete(`/chat/${id}`);
    return r.data;
  }

  // Método para atualizar uma mensagem
  async atualizarMensagem(id, novaMensagem) {
    let r = await api.put(`/chat/${id}`, {
      mensagem: novaMensagem,
    });
    return r.data;
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
}
