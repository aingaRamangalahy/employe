import { Schema } from 'mongoose';

export const ServiceSchema = new Schema(
  {
    id: Number,
    intitule: {
      type: String,
      required: false,
      trim: true,
      minlength: [2, 'Please use 2 or more characters'],
      maxlength: [50, 'Max authorized characters is 50'],
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
