import dbConnect from 'lib/mongodb';
import { SKUModel, SaleModel } from 'models';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   try {
//     const data = request.nextUrl.searchParams;

//     const filterData = {
//       id: data.get('id') || undefined,
//       name: data.get('name') || undefined,
//       code: data.get('code') || undefined,
//       page: Number(data.get('page')) || 1,
//       limit: Number(data.get('limit')) || 10,
//     };
//     const { id, name, code, page, limit } = filterData;

//     const query = {
//       ...(id ? { _id: id } : {}),
//       ...(name ? { name: { $regex: name, $options: 'i' } } : {}),
//       ...(code ? { code } : {}),
//     };

//     await dbConnect();
//     // Fetch all SKUs
//     const totalSkus = await SKUModel.countDocuments(query);
//     console.log(
//       '🚀 ~ GET ~ (Number(page) - 1) * Number(limit):',
//       (Number(page) - 1) * Number(limit)
//     );
//     const skus = await SKUModel.find(query, { __v: 0 })
//       .sort({
//         createdAt: -1,
//       })
//       .skip((Number(page) - 1) * Number(limit))
//       .limit(Number(limit));

//     return NextResponse.json({ data: skus, total: totalSkus });
//   } catch (err) {
//     return Response.json(`Error fetching SKU: ${err} `, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  const data = await request.json();
  await dbConnect();

  try {
    const { id, ...saleData } = data as {
      id: string;
      quantity: number;
      priceUnit?: number;
      priceTotal?: number;
    };

    // Validate saleData here

    const sku = await SKUModel.findById(id);
    if (!sku) {
      throw new Error('SKU not found');
    }

    const { priceUnit, quantity, priceTotal } = saleData;
    let salesPriceTotal = priceTotal;
    let salesPriceUnit = priceUnit;
    if (priceTotal === undefined && priceUnit) {
      salesPriceTotal = priceUnit * quantity;
    } else if (priceUnit === undefined && priceTotal) {
      salesPriceUnit = priceTotal / quantity;
    } else if (!priceUnit && !priceTotal) {
      throw new Error('Price unit or price total are not provided');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    const updatedStock = sku.stock - quantity;
    if (updatedStock < 0) {
      throw new Error('Stock not sufficient');
    }

    const sale = new SaleModel({
      skuId: new Types.ObjectId(id),
      priceUnit: Types.Decimal128.fromString(salesPriceUnit!.toString()),
      priceTotal: Types.Decimal128.fromString(salesPriceTotal!.toString()),
      quantity,
    });
    await sale.save();

    sku.stock = updatedStock;
    await sku.save();

    return NextResponse.json(sale);
  } catch (error) {
    console.log('🚀 ~ POST ~ error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'Error recording sale' },
        { status: 500 }
      );
    }
  }
}

// export async function PUT(request: NextRequest) {
//   const data = await request.json();
//   try {
//     await dbConnect();
//     const { id, ...updateData } = data;
//     const sku = await SKUModel.findById(id);
//     if (!sku) {
//       return Response.json(`SKU not found`, { status: 404 });
//     }
//     sku.set(updateData);
//     const updatedSku = await sku.save();
//     return Response.json(updatedSku);
//   } catch (error) {
//     return Response.json(`Error updating SKU: ${error} `, { status: 500 });
//   }
// }

// export async function DELETE(request: NextRequest) {
//   const data = await request.json();
//   console.log('🚀 ~ DELETE ~ data:', data);
//   try {
//     await dbConnect();
//     const { id } = data;
//     const sku = await SKUModel.findById(id);
//     if (!sku) {
//       return Response.json(`SKU not found`, { status: 404 });
//     }
//     await sku.deleteOne();
//     return Response.json('SKU deleted');
//   } catch (error) {
//     return Response.json(`Error deleting SKU: ${error} `, { status: 500 });
//   }
// }
