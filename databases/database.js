import Database from 'better-sqlite3';

let db = null;

export function initializeDatabase() {
    if (db) {
        return db;
    }
    
    db = new Database('./database.sqlite', { verbose: console.log });

    // Create users table
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT
    );
    `);

    // Create events table
    db.exec(`
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY,
        dataTransferItemList TEXT,
        description TEXT,
        address TEXT,
        date TEXT
    );
    `);

    return db;
}   

export function getDatabase() {
    if (!db) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
}


