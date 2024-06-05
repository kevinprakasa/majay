import mongoose, { Document, Model, Schema } from 'mongoose';

export interface SKU {
  name: string;
  code: string;
  stock: number;
  capitalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WithId<T> = T & { id: string };

interface SKUSchema extends SKU, Document {}

const skuSchema: Schema<SKUSchema> = new Schema({
  name: { type: String, required: true },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true,
  },
  stock: { type: Number, required: true },
  capitalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Adding the transformation function
skuSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

skuSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const SKUModel: Model<SKUSchema> =
  mongoose.models.SKU || mongoose.model<SKUSchema>('SKU', skuSchema);

// interface Transaction extends Document {
//   sku: SKU;
//   quantity: number;
//   sellPrice: number; // price per unit
//   type: 'in' | 'out';
//   createdAt: Date;
// }
