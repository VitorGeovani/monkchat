import db from "../db.js";

class RoomRepository {
  async create(room) {
    const [result] = await db.query(
      "INSERT INTO TB_SALA (ID_USUARIO, NM_SALA) VALUES (?, ?)",
      [room.userId, room.name]
    );
    return { id: result.insertId, ...room };
  }

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM TB_SALA WHERE ID_SALA = ?", [
      id,
    ]);
    return rows[0];
  }

  async findAll() {
    const [rows] = await db.query("SELECT * FROM TB_SALA");
    return rows;
  }

  async findByUser(userId) {
    const [rows] = await db.query(
      `SELECT s.* FROM TB_SALA s
       JOIN TB_PARTICIPANTE p ON s.ID_SALA = p.ID_SALA
       WHERE p.ID_USUARIO = ?`,
      [userId]
    );
    return rows;
  }

  async findByName(name) {
    const [rows] = await db.query("SELECT * FROM TB_SALA WHERE NM_SALA = ?", [
      name,
    ]);
    return rows[0];
  }
}

export default new RoomRepository();
