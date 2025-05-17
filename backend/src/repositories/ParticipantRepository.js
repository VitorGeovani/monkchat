import db from "../db.js";

class ParticipantRepository {
  async addParticipant(roomId, userId) {
    try {
      const [result] = await db.query(
        "INSERT INTO TB_PARTICIPANTE (ID_SALA, ID_USUARIO) VALUES (?, ?)",
        [roomId, userId]
      );
      return { id: result.insertId, roomId, userId };
    } catch (error) {
      // Verifica se é erro de chave duplicada (participante já existe)
      if (error.code === "ER_DUP_ENTRY") {
        return { roomId, userId, exists: true };
      }
      throw error;
    }
  }

  async removeParticipant(roomId, userId) {
    const [result] = await db.query(
      "DELETE FROM TB_PARTICIPANTE WHERE ID_SALA = ? AND ID_USUARIO = ?",
      [roomId, userId]
    );
    return result.affectedRows > 0;
  }

  async findByRoom(roomId) {
    const [rows] = await db.query(
      `SELECT u.ID_USUARIO, u.NM_USUARIO, u.DS_EMAIL 
       FROM TB_USUARIO u
       JOIN TB_PARTICIPANTE p ON u.ID_USUARIO = p.ID_USUARIO
       WHERE p.ID_SALA = ?`,
      [roomId]
    );
    return rows;
  }
}

export default new ParticipantRepository();
