import Database from 'better-sqlite3';

// Open a connection to the SQLite database
const db = new Database('database.sqlite');

// Create the events table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dataTransferItemList TEXT,
        description TEXT,
        address TEXT,
        date TEXT
    )
`);

// Function to create a new event
export function createEvent({ dataTransferItemList, description, address, date }) {
    const stmt = db.prepare(`
        INSERT INTO events (dataTransferItemList, description, address, date)
        VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(dataTransferItemList, description, address, new Date(date).toISOString());
    return { id: info.lastInsertRowid, dataTransferItemList, description, address, date };
}

// Function to edit an existing event
export function editEvent(id, { dataTransferItemList, description, address, date }) {
    const stmt = db.prepare(`
        UPDATE events
        SET dataTransferItemList = ?, description = ?, address = ?, date = ?
        WHERE id = ?
    `);
    const info = stmt.run(dataTransferItemList, description, address, new Date(date).toISOString(), id);
    if (info.changes === 0) {
        throw new Error('Event not found');
    }
    return { id, dataTransferItemList, description, address, date };
}

// Function to delete an event
export function deleteEvent(id) {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) {
        throw new Error('Event not found');
    }
    return { id };
}

// Function to get all events
export function getAllEvents() {
    const stmt = db.prepare('SELECT * FROM events');
    return stmt.all();
}

// Function to get a single event by ID
export function getEventById(id) {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = stmt.get(id);
    if (!event) {
        throw new Error('Event not found');
    }
    return event;
}
