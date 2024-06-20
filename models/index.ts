import {
  Document,
  Model,
  Schema,
  Types,
  models,
  model,
  Decimal128,
} from 'mongoose';

export interface SKU {
  name: string;
  code: string;
  stock: number;
  capitalPrice: string;
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
  // @ts-ignore
  capitalPrice: { type: Types.Decimal128, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Adding the transformation function
skuSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.capitalPrice = ret.capitalPrice.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

skuSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.capitalPrice = ret.capitalPrice.toString();

    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const SKUModel: Model<SKUSchema> =
  models.SKU || model<SKUSchema>('SKU', skuSchema);

export interface Sale {
  skuId: string;
  quantity: number;
  priceUnit: string;
  priceTotal: string;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new Schema({
  skuId: { type: Schema.Types.ObjectId, ref: 'SKU', required: true },
  quantity: { type: Number, required: true },
  priceUnit: { type: Types.Decimal128, required: true },
  priceTotal: { type: Types.Decimal128, required: true },
  createdAt: { type: Date, default: Date.now }, // aka. Sale date
  updatedAt: { type: Date, default: Date.now },
});

saleSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.priceUnit = ret.priceUnit.toString();
    ret.priceTotal = ret.priceTotal.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

saleSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.priceUnit = ret.priceUnit.toString();
    ret.priceTotal = ret.priceTotal.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const SaleModel: Model<Document & Sale> =
  models.Sale || model('Sale', saleSchema);
