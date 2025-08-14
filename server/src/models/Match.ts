import mongoose, { Schema, InferSchemaType } from 'mongoose';

const MatchSchema = new Schema(
  {
    userA: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userB: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isMutual: { type: Boolean, default: false },
    // Store snapshot of filter/match context if needed
    context: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

MatchSchema.index({ userA: 1, userB: 1 }, { unique: true });

export type Match = InferSchemaType<typeof MatchSchema> & { _id: mongoose.Types.ObjectId };
export const MatchModel = mongoose.model('Match', MatchSchema);


