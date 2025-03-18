import { getDatabase } from '../databases/database.js';
import bcrypt from 'bcryptjs';

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return typeof password === 'string' && 
           password.trim().length >= 6;
}

export async function createUser(userData) {
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const stmt = getDatabase().prepare(
        'INSERT INTO users (email, password) VALUES (?, ?)'
    );
    
    const result = stmt.run(email.trim(), hashedPassword);
    
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

export async function verifyUserCredentials(email, password) {
    if (!email || !email.trim()) {
        throw new Error('Email is required');
    }
    if (!password || !password.trim()) {
        throw new Error('Password is required');
    }

    const user = findUserByEmail(email.trim());
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
    };
}


