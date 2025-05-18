import mongoose, { Schema, Document } from "mongoose";

interface Tea extends Document {
  name: string;
  type: string;
  caffeine: string;
  brewingTime: number;
  temperatureCelsius: number;
  temperatureFahrenheit: number;
  description: string;
  usage: string;
  flavorNotes: string[];
  purchaseDate: Date;
}
const teaSchema = new Schema<Tea>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  caffeine: { type: String, required: true },
  brewingTime: { type: Number, required: true },
  temperatureCelsius: { type: Number, required: true },
  temperatureFahrenheit: { type: Number, required: true },
  description: { type: String, required: true },
  usage: { type: String, required: true },
  flavorNotes: { type: [String], required: true },
  purchaseDate: { type: Date, required: false },
});

const TeaModel = mongoose.model<Tea>("Tea", teaSchema);

export default TeaModel;
