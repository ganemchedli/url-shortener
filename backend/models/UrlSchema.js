import { Schema, model } from "mongoose";

const urlSchema = new Schema({
  urlId: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Url = model("Url", urlSchema);

export default Url;
