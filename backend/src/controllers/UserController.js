import UserRepository from "../repositories/UserRepository.js";

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ erro: "Nome, email e senha são obrigatórios" });
      }

      // Verifica se o email já existe
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ erro: "Este email já está em uso" });
      }

      // Cria o usuário
      const user = await UserRepository.create({
        name,
        email,
        password,
      });

      // Remove a senha do objeto retornado
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios" });
      }

      const user = await UserRepository.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }

      // Verifica se a senha está correta
      if (user.DS_SENHA !== password) {
        console.log(
          "Senha incorreta. Fornecida:",
          password,
          "Esperada:",
          user.DS_SENHA
        );
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Retorna os dados do usuário
      return res.status(200).json({
        user: {
          ID_USUARIO: user.ID_USUARIO,
          NM_USUARIO: user.NM_USUARIO,
          DS_EMAIL: user.DS_EMAIL,
          id_usuario: user.ID_USUARIO,
          nm_usuario: user.NM_USUARIO,
          ds_email: user.DS_EMAIL,
        },
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserRepository.findAll();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ erro: "Nome é obrigatório" });
      }

      const user = await UserRepository.findById(id);
      if (!user) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const updated = await UserRepository.updateUser(id, { name });
      if (!updated) {
        return res.status(500).json({ erro: "Erro ao atualizar usuário" });
      }

      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }

  // Método de redefinição de senha
  async resetPassword(req, res) {
    try {
      const { id, currentPassword, newPassword } = req.body;

      console.log("Solicitação de redefinição de senha recebida:", {
        id,
        hasCurrentPwd: !!currentPassword,
        hasNewPwd: !!newPassword,
      });

      // Validação básica
      if (!id || !currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ erro: "Todos os campos são obrigatórios" });
      }

      // Busca o usuário pelo ID
      const user = await UserRepository.findById(id);
      if (!user) {
        console.log("Usuário não encontrado com ID:", id);
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      console.log("Verificando senha para usuário:", user.NM_USUARIO);
      console.log("Senha armazenada:", user.DS_SENHA);
      console.log("Senha fornecida:", currentPassword);

      // Verifica se a senha atual está correta
      if (user.DS_SENHA !== currentPassword) {
        console.log("Senha atual incorreta para usuário ID:", id);
        return res.status(401).json({ erro: "Senha atual incorreta" });
      }

      // Atualiza a senha
      const updated = await UserRepository.updatePassword(id, newPassword);

      if (!updated) {
        return res.status(500).json({ erro: "Erro ao atualizar senha" });
      }

      console.log("Senha atualizada com sucesso para usuário ID:", id);

      // Verificar se a senha foi realmente atualizada
      const updatedUser = await UserRepository.findById(id);
      console.log("Nova senha armazenada:", updatedUser.DS_SENHA);

      return res.status(200).json({ message: "Senha atualizada com sucesso" });
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }
}

export default new UserController();
