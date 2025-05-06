import mongoose, { Schema, Document } from "mongoose";

export interface ITea extends Document {
  name: string;
  brand: string;
  type: string;
  imageUrl?: string;
  tastingNotes?: string;
  tags?: string[];
  createdBy: mongoose.Types.ObjectId; // linked to user
  rating?: number;
  favorite?: boolean;
  description?: string;
  caffeineLevel?: string;
  brewTempCelsius?: number;
  brewTimeSeconds?: number;
}

const TeaSchema: Schema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: false },
  type: { type: String, required: true },
  imageUrl: { type: String }, // optional
  tastingNotes: { type: String },
  tags: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
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
  description: {
    type: String,
  },
  caffeineLevel: {
    type: String,
  },
  brewTempCelsius: {
    type: Number,
  },
  brewTimeSeconds: {
    type: Number,
  },
});

const TeaCategory = mongoose.model<ITea>("TeaCategory", TeaSchema);

export default TeaCategory;
