import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_secret_key';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';


export function generateJWT(user) {
    const payload = {
        id: user.id,
        email: user.email
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
}

export function verifyJWT(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}
