import { Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new Schema(
  {
    id: Number,
    name: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      trim: true,
    },
    role: {
      type: String,
      default: 'employe',
      enum: ['employe', 'admin'],
    },
    salaire: {
      type: Number,
      default: 0,
    },
    service: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, required: false },
  },
  { _id: true },
);

/**
 * Crypt user password before save
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
