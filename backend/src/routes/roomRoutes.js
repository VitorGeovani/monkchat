import { Router } from 'express';
import RoomController from '../controllers/RoomController.js';
import ParticipantController from '../controllers/ParticipantController.js';

const router = Router();

router.post('/', RoomController.createRoom);
router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getRoomById);
router.get('/user/:userId', RoomController.getUserRooms);

// Rotas de participantes
router.post('/participants', ParticipantController.addParticipant);
router.delete('/participants/:roomId/:userId', ParticipantController.removeParticipant);
router.get('/:roomId/participants', ParticipantController.getRoomParticipants);

export default router;