import dbConnect from 'lib/mongodb';
import { SKUModel } from 'models';
import { Error } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const data = request.nextUrl.searchParams;

    const filterData = {
      id: data.get('id') || undefined,
      name: data.get('name') || undefined,
      code: data.get('code') || undefined,
      page: Number(data.get('page')) || 1,
      limit: Number(data.get('limit')) || 10,
    };
    const { id, name, code, page, limit } = filterData;

    const query = {
      ...(id ? { _id: id } : {}),
      ...(name ? { name: { $regex: name, $options: 'i' } } : {}),
      ...(code ? { code: { $regex: code, $options: 'i' } } : {}),
    };

    await dbConnect();
    // Fetch all SKUs
    const totalSkus = await SKUModel.countDocuments(query);

    const skus = await SKUModel.find(query, { __v: 0 })
      .sort({
        createdAt: -1,
      })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return NextResponse.json({ data: skus, total: totalSkus });
  } catch (err) {
    return Response.json(`Error fetching SKU: ${err} `, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  await dbConnect();
  try {
    // Validating the data first
    const sku = new SKUModel(data);
    const newSku = await sku.save();
    return Response.json(newSku);
  } catch (error) {
    // @ts-ignore
    if (error?.code === 11000) {
      return Response.json(`SKU already exists`, { status: 400 });
    }
    return Response.json(`Error creating SKU: ${error} `, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  try {
    await dbConnect();
    const { id, ...updateData } = data;
    const sku = await SKUModel.findById(id);
    if (!sku) {
      return Response.json(`SKU not found`, { status: 404 });
    }
    sku.set(updateData);
    const updatedSku = await sku.save();
    return Response.json(updatedSku);
  } catch (error) {
    return Response.json(`Error updating SKU: ${error} `, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  try {
    await dbConnect();
    const { id } = data;
    const sku = await SKUModel.findById(id);
    if (!sku) {
      return Response.json(`SKU not found`, { status: 404 });
    }
    await sku.deleteOne();
    return Response.json('SKU deleted');
  } catch (error) {
    return Response.json(`Error deleting SKU: ${error} `, { status: 500 });
  }
}
