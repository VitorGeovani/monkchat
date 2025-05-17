import MessageRepository from '../repositories/MessageRepository.js';

class MessageController {
    async sendMessage(req, res) {
        try {
            const { senderId, receiverId, receiverName, roomId, content, messageType } = req.body;
            
            if (!senderId || !roomId || !content) {
                return res.status(400).json({ error: 'ID do remetente, ID da sala e conteúdo são obrigatórios' });
            }

            const message = await MessageRepository.create({
                senderId,
                receiverId,
                receiverName,
                roomId,
                content,
                messageType: messageType || 'mensagem'
            });
            
            return res.status(201).json(message);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Adicione este método à classe MessageController

async updateMessage(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Conteúdo da mensagem é obrigatório' });
    }
    
    // Verificar se a mensagem existe
    const message = await MessageRepository.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    
    // Atualizar a mensagem
    const updatedMessage = await MessageRepository.updateById(id, content);
    
    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Erro ao atualizar mensagem:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

    async getRoomMessages(req, res) {
        try {
            const { roomId } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            
            const messages = await MessageRepository.findByRoom(roomId, limit);
            
            return res.status(200).json(messages);
        } catch (error) {
            console.error('Erro ao buscar mensagens da sala:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getDirectMessages(req, res) {
        try {
            const { senderId, receiverId } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            
            const messages = await MessageRepository.findDirectMessages(senderId, receiverId, limit);
            
            return res.status(200).json(messages);
        } catch (error) {
            console.error('Erro ao buscar mensagens diretas:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    
    async deleteMessage(req, res) {
        try {
            const { id } = req.params;
            const deleted = await MessageRepository.deleteById(id);
            
            if (!deleted) {
                return res.status(404).json({ error: 'Mensagem não encontrada' });
            }
            
            return res.status(200).json({ message: 'Mensagem removida com sucesso' });
        } catch (error) {
            console.error('Erro ao remover mensagem:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new MessageController();