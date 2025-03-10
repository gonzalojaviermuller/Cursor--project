import { createUser, findUserByEmail } from '../models/user.js';

export function signup(req, res) {
    const { email, password } = req.body;

    //check if email and password are not empty or just white spaces
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const userExists = findUserByEmail(email);
    if (userExists) {
        return res.status(400).json({ message: 'Email is already registered' });
    }

    try {
        const newUser = createUser({ email, password });
        res.status(201).json({
        message: 'User created successfully',
        user: newUser
    });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the user', details: error.message });
    }
}

export function login(req, res) {
    const { email, password } = req.body;

    //check if email and password are not empty or just white spaces
    if (!email || !email.trim() || !password || !password.trim()) {
        return res.status(400).json({ message: 'Email and password are required and cannot be empty' });
    }

    // Find user
    const user = findUserByEmail(email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email
        }
    });
}