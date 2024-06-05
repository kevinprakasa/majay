import dbConnect from 'lib/mongodb';
import { SKUModel } from 'models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log('🚀 ~ POST ~ data:', data);
  await dbConnect();
  try {
    // Validating the data first
    const sku = new SKUModel(data);
    const newSku = await sku.save();
    return Response.json(newSku);
  } catch (error) {
    return Response.json(`Error creating SKU: ${error} `, { status: 500 });
  }
}

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
      ...(code ? { code } : {}),
    };

    await dbConnect();
    // Fetch all SKUs
    const totalSkus = await SKUModel.countDocuments(query);
    console.log(
      '🚀 ~ GET ~ (Number(page) - 1) * Number(limit):',
      (Number(page) - 1) * Number(limit)
    );
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
