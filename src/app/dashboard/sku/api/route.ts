import dbConnect from 'lib/mongodb';
import { SKU } from 'models';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log('🚀 ~ POST ~ data:', data);
  await dbConnect();
  try {
    // Validating the data first
    const sku = new SKU(data);
    const newSku = await sku.save();
    console.log('🚀 ~ POST ~ newSku:', newSku);
    // Can be moved to client side, since we don't need to store the image, just
    // QRCode.toDataURL(
    //   newSku.code,
    //   {
    //     errorCorrectionLevel: 'H',
    //     scale: 8,

    //   },
    //   (err, url) => {
    //     console.log('🚀 ~ QRCode.toDataURL ~ url:', url);
    //   }
    // );
    return Response.json(newSku);
  } catch (error) {
    return Response.json(`Error creating SKU: ${error} `, { status: 500 });
  }
}
