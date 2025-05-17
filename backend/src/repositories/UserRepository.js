import db from "../db.js";

class UserRepository {
  async create(user) {
    const [result] = await db.query(
      "INSERT INTO TB_USUARIO (NM_USUARIO, DS_EMAIL, DS_SENHA) VALUES (?, ?, ?)",
      [user.name, user.email, user.password]
    );
    return { id: result.insertId, ...user };
  }

  async findByEmail(email) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM TB_USUARIO WHERE DS_EMAIL = ?",
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM TB_USUARIO WHERE ID_USUARIO = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw error;
    }
  }

  async findAll() {
    const [rows] = await db.query("SELECT * FROM TB_USUARIO");
    return rows;
  }

  async updateUser(id, userData) {
    try {
      const [result] = await db.query(
        "UPDATE TB_USUARIO SET NM_USUARIO = ? WHERE ID_USUARIO = ?",
        [userData.name, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  async updatePassword(id, password) {
    try {
      console.log("Atualizando senha para usuário ID:", id);
      console.log("Nova senha:", password);

      const [result] = await db.query(
        "UPDATE TB_USUARIO SET DS_SENHA = ? WHERE ID_USUARIO = ?",
        [password, id]
      );

      console.log("Resultado da atualização:", result);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      throw error;
    }
  }
}

export default new UserRepository();
