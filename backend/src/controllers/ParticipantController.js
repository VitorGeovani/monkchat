import ParticipantRepository from '../repositories/ParticipantRepository.js';

class ParticipantController {
  async addParticipant(req, res) {
    try {
      const { roomId, userId } = req.body;
      
      if (!roomId || !userId) {
        return res.status(400).json({ error: 'ID da sala e ID do usuário são obrigatórios' });
      }

      const result = await ParticipantRepository.addParticipant(roomId, userId);
      
      if (result.exists) {
        return res.status(200).json({ message: 'Usuário já é participante desta sala' });
      }
      
      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async removeParticipant(req, res) {
    try {
      const { roomId, userId } = req.params;
      
      const removed = await ParticipantRepository.removeParticipant(roomId, userId);
      
      if (!removed) {
        return res.status(404).json({ error: 'Participante não encontrado' });
      }
      
      return res.status(200).json({ message: 'Participante removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover participante:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getRoomParticipants(req, res) {
    try {
      const { roomId } = req.params;
      
      const participants = await ParticipantRepository.findByRoom(roomId);
      
      return res.status(200).json(participants);
    } catch (error) {
      console.error('Erro ao buscar participantes da sala:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new ParticipantController();