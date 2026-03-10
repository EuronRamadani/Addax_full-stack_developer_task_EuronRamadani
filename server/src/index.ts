import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/calendar-tasks';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/tasks', taskRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
