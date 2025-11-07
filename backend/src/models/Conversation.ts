import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  level: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  level: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
