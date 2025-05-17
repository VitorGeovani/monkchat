import db from "../db.js";

class MessageRepository {
  async create(message) {
    const [result] = await db.query(
      "INSERT INTO TB_MENSAGEM (ID_USUARIO_ENVIO, ID_USUARIO_PARA, NM_USUARIO_PARA, ID_SALA, DS_MENSAGEM, TP_MENSAGEM) VALUES (?, ?, ?, ?, ?, ?)",
      [
        message.senderId,
        message.receiverId || null,
        message.receiverName || null,
        message.roomId,
        message.content,
        message.messageType || "mensagem",
      ]
    );
    return { id: result.insertId, ...message };
  }

  async findById(id) {
    const [rows] = await db.query(
      `SELECT m.*, u.NM_USUARIO as sender_name 
     FROM TB_MENSAGEM m
     JOIN TB_USUARIO u ON m.ID_USUARIO_ENVIO = u.ID_USUARIO
     WHERE m.ID_MENSAGEM = ?`,
      [id]
    );
    return rows[0];
  }

  async updateById(id, content) {
    const [result] = await db.query(
      "UPDATE TB_MENSAGEM SET DS_MENSAGEM = ? WHERE ID_MENSAGEM = ?",
      [content, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  async findByRoom(roomId, limit = 50) {
    const [rows] = await db.query(
      `SELECT m.*, u.NM_USUARIO as sender_name 
         FROM TB_MENSAGEM m
         JOIN TB_USUARIO u ON m.ID_USUARIO_ENVIO = u.ID_USUARIO
         WHERE m.ID_SALA = ?
         ORDER BY m.DT_MENSAGEM ASC
         LIMIT ?`,
      [roomId, limit]
    );
    return rows;
  }

  async findDirectMessages(senderId, receiverId, limit = 50) {
    const [rows] = await db.query(
      `SELECT m.*, u.NM_USUARIO as sender_name 
             FROM TB_MENSAGEM m
             JOIN TB_USUARIO u ON m.ID_USUARIO_ENVIO = u.ID_USUARIO
             WHERE (m.ID_USUARIO_ENVIO = ? AND m.ID_USUARIO_PARA = ?)
             OR (m.ID_USUARIO_ENVIO = ? AND m.ID_USUARIO_PARA = ?)
             ORDER BY m.DT_MENSAGEM ASC
             LIMIT ?`,
      [senderId, receiverId, receiverId, senderId, limit]
    );
    return rows;
  }

  async deleteById(id) {
    const [result] = await db.query(
      "DELETE FROM TB_MENSAGEM WHERE ID_MENSAGEM = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

export default new MessageRepository();
