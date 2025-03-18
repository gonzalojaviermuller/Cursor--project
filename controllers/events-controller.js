import { 
    createEvent, 
    editEvent, 
    deleteEvent, 
    getAllEvents, 
    getEventById 
} from '../models/event.js';

// Create a new event
export function createEventController(req, res) {
    try {
        const { dataTransferItemList, description, address, date } = req.body;

        // Basic validation
        if (!description || !address || !date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const newEvent = createEvent({
            dataTransferItemList,
            description,
            address,
            date
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: newEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
}

// Edit an existing event
export function editEventController(req, res) {
    try {
        const { id } = req.params;
        const { dataTransferItemList, description, address, date } = req.body;

        // Basic validation
        if (!description || !address || !date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const updatedEvent = editEvent(Number(id), {
            dataTransferItemList,
            description,
            address,
            date
        });

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: updatedEvent
        });
    } catch (error) {
        res.status(error.message === 'Event not found' ? 404 : 500).json({
            success: false,
            message: error.message === 'Event not found' ? 'Event not found' : 'Error updating event',
            error: error.message
        });
    }
}

// Delete an event
export function deleteEventController(req, res) {
    try {
        const { id } = req.params;
        deleteEvent(Number(id));

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(error.message === 'Event not found' ? 404 : 500).json({
            success: false,
            message: error.message === 'Event not found' ? 'Event not found' : 'Error deleting event',
            error: error.message
        });
    }
}

// Get all events
export function getAllEventsController(req, res) {
    try {
        const events = getAllEvents();
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
}

// Get a single event by ID
export function getEventByIdController(req, res) {
    try {
        const { id } = req.params;
        const event = getEventById(Number(id));

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(error.message === 'Event not found' ? 404 : 500).json({
            success: false,
            message: error.message === 'Event not found' ? 'Event not found' : 'Error fetching event',
            error: error.message
        });
    }
}
