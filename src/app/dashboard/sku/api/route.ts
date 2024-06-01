import dbConnect from 'lib/mongodb';
import { SKU } from 'models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log('🚀 ~ POST ~ data:', data);
  await dbConnect();

  try {
    // Validating the data first
    const sku = new SKU(data);
    const newSku = await sku.save();
    console.log('🚀 ~ POST ~ newSku:', newSku);
    return Response.json(newSku);
  } catch (error) {
    return Response.json(`Error creating SKU: ${error} `, { status: 500 });
  }
}
