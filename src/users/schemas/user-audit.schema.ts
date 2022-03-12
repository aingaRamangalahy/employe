import { Schema } from 'mongoose';

export const UserAuditSchema = new Schema(
  {
    user: {
      type: String,
    },
    when: { type: Date, default: Date.now },
    who: {
      type: String,
    },
    what: {
      // action
      type: String,
    },
    oldSalaire: {
      type: Number,
    },
    newSalaire: {
      type: Number,
    },
  },
  { _id: true },
);
