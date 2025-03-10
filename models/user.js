import { getDatabase } from '../databases/database.js';

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return typeof password === 'string' && 
           password.trim().length >= 6;
}

export function createUser(userData) {
    const { email, password } = userData;

    // Validate email
    if (!email || !email.trim()) {
        throw new Error('Email is required');
    }
    if (!isValidEmail(email.trim())) {
        throw new Error('Invalid email format');
    }

    // Validate password
    if (!password || !password.trim()) {
        throw new Error('Password is required');
    }
    if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters long');
    }

    const stmt = getDatabase().prepare(
        'INSERT INTO users (email, password) VALUES (?, ?)'
    );
    
    const result = stmt.run(email.trim(), password);
    
    return {
        id: result.lastInsertRowid,
        email: email.trim(),
        createdAt: new Date()
    };
}

export function findUserByEmail(email) {
    if (!email || !email.trim()) {
        return null;
    }
    
    const stmt = getDatabase().prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email.trim()) || null;
}