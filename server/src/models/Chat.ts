import mongoose, { Schema, InferSchemaType } from 'mongoose';

const MessageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChatSchema = new Schema(
  {
    userIds: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export type Chat = InferSchemaType<typeof ChatSchema> & { _id: mongoose.Types.ObjectId };
export const ChatModel = mongoose.model('Chat', ChatSchema);


