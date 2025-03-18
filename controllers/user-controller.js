import { createUser, findUserByEmail, verifyUserCredentials } from '../models/user.js';
import { generateJWT } from '../util/auth.js';

export async function signup(req, res) {
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
        const newUser = await createUser({ email, password });
        const token = generateJWT(newUser);
        res.status(201).json({
            message: `User created successfully`,
            user: newUser,
            token: token
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the user', details: error.message });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    //check if email and password are not empty or just white spaces
    if (!email || !email.trim() || !password || !password.trim()) {
        return res.status(400).json({ message: 'Email and password are required and cannot be empty' });
    }

    try {
        const user = await verifyUserCredentials(email, password);
        
        const token = generateJWT(user);
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email
            },
            token: token
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid credentials' });
    }
}