import { Schema } from 'mongoose';

export const UserAuditSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    when: { type: Date, default: Date.now },
    who: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    what: {
      // action
      type: String,
    },
    oldSalaire: {
      type: Number,
    },
    newSalaire: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
  },
  { _id: true },
);
