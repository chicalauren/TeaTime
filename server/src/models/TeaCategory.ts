import mongoose, { Schema, Document } from 'mongoose';

export interface ITea extends Document {
  name: string;
  brand: string;
  type: string;
  imageUrl?: string;
  tastingNotes?: string;
  tags?: string[];
  createdBy: mongoose.Types.ObjectId; // linked to user
}

const TeaSchema: Schema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  imageUrl: { type: String }, // optional
  tastingNotes: { type: String },
  tags: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

TeaSchema.add({
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const TeaCategory = mongoose.model<ITea>('TeaCategory', TeaSchema);

export default TeaCategory;
