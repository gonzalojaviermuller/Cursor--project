import { Router } from 'express';
import {
    createEventController,
    editEventController,
    deleteEventController,
    getAllEventsController,
    getEventByIdController
} from '../controllers/events-controller.js';

const router = Router();

// Create a new event
router.post('/', createEventController);

// Edit an existing event
router.put('/:id', editEventController);

// Delete an event
router.delete('/:id', deleteEventController);

// Get a single event by ID
router.get('/:id', getEventByIdController);

// Get all events
router.get('/', getAllEventsController);

export default router;

