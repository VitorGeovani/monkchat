import RoomRepository from '../repositories/RoomRepository.js';
import ParticipantRepository from '../repositories/ParticipantRepository.js';

class RoomController {
  async createRoom(req, res) {
    try {
      const { name, userId } = req.body;
      
      if (!name || !userId) {
        return res.status(400).json({ error: 'Nome da sala e ID do usuário são obrigatórios' });
      }

      // Verificar se já existe uma sala com este nome
      const existingRoom = await RoomRepository.findByName(name);
      if (existingRoom) {
        return res.status(400).json({ error: 'Já existe uma sala com este nome' });
      }

      const room = await RoomRepository.create({ name, userId });
      
      // Adiciona o criador como participante da sala
      await ParticipantRepository.addParticipant(room.id, userId);
      
      return res.status(201).json(room);
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getAllRooms(req, res) {
    try {
      const rooms = await RoomRepository.findAll();
      return res.status(200).json(rooms);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getRoomById(req, res) {
    try {
      const { id } = req.params;
      const room = await RoomRepository.findById(id);
      
      if (!room) {
        return res.status(404).json({ error: 'Sala não encontrada' });
      }
      
      // Busca os participantes da sala
      const participants = await ParticipantRepository.findByRoom(id);
      
      return res.status(200).json({ ...room, participants });
    } catch (error) {
      console.error('Erro ao buscar sala:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getUserRooms(req, res) {
    try {
      const { userId } = req.params;
      const rooms = await RoomRepository.findByUser(userId);
      return res.status(200).json(rooms);
    } catch (error) {
      console.error('Erro ao buscar salas do usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new RoomController();