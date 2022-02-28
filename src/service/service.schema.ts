import { Schema } from 'mongoose';

export const ServiceSchema = new Schema(
  {
    id: Number,
    intitule: {
      type: String,
      trim: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, required: false },
  },
  { _id: true },
);

export interface Service {
  _id?: string;
  id?: number;
  intitule: string;
}
