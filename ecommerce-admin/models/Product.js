import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  properties: { type: [Object], required: false }

}, { timestamps: true });

export const Product = models.Product || model("Product", ProductSchema);
