import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { initializeDatabase } from './databases/database.js';

const app = express();

app.use(express.json());

// Routes
app.use('/users', userRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
    // Initialize database
    try{
        initializeDatabase();
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
});
