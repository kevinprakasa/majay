import mongoose, { Document, Model, Schema } from 'mongoose';

export interface SKU {
  name: string;
  code: string;
  stock: number;
  capitalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SKUSchema extends SKU, Document {}

const skuSchema: Schema<SKUSchema> = new Schema({
  name: { type: String, required: true },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  stock: { type: Number, required: true },
  capitalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const SKU: Model<SKUSchema> =
  mongoose.models.SKU || mongoose.model<SKUSchema>('SKU', skuSchema);

// interface Transaction extends Document {
//   sku: SKU;
//   quantity: number;
//   sellPrice: number; // price per unit
//   type: 'in' | 'out';
//   createdAt: Date;
// }
