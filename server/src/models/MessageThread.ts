import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  readBy: mongoose.Types.ObjectId[];
}

export interface IMessageThread extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const messageThreadSchema = new Schema<IMessageThread>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [messageSchema],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IMessageThread>("MessageThread", messageThreadSchema);