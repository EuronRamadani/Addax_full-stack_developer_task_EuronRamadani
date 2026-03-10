import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  date: string;
  order: number;
  color?: string;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    order: { type: Number, required: true, default: 0 },
    color: { type: String, default: '#4A90E2' },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);
