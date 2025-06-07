import dbConnect from 'lib/mongodb';
import { SKUModel, SaleModel } from 'models';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const data = request.nextUrl.searchParams;

    const filterData = {
      startDate: data.get('startDate') || undefined,
      endDate: data.get('endDate') || undefined,
      // page: Number(data.get('page')) || 1, // @TODO: Implement pagination
      // limit: Number(data.get('limit')) || 10,
    };
    const { startDate, endDate } = filterData;

    const query = {
      createdAt: {
        $gte: new Date(startDate || '1970-01-01'),
        $lte: new Date(endDate || '9999-12-31'),
      },
    };

    await dbConnect();
    // Fetch all SKUs
    const totalSales = await SaleModel.countDocuments(query);

    const sales = await SaleModel.find(query, { __v: 0 }).sort({
      createdAt: -1,
    });
    // .skip((filterData.page - 1) * filterData.limit)
    // .limit(filterData.limit);

    const skus = await SKUModel.find(
      {
        _id: { $in: sales.map((sale) => sale.skuId) },
      },
      { __v: 0 }
    );

    return NextResponse.json({
      data: {
        sales,
        skus: skus.reduce(
          (acc, sku) => {
            acc[sku.id] = sku;
            return acc;
          },
          {} as Record<string, unknown>
        ),
      },
      total: totalSales,
    });
  } catch (err) {
    return Response.json(`Error fetching SKU: ${err} `, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  await dbConnect();

  try {
    // Handle both single sale and multiple sales
    const salesData = Array.isArray(data) ? data : [data];

    const createdSales: InstanceType<typeof SaleModel>[] = [];
    const updatedSkus = new Map<
      string,
      { sku: InstanceType<typeof SKUModel>; updatedStock: number }
    >();

    // First pass: validate all sales and prepare data
    for (const saleData of salesData) {
      const { id, ...saleInfo } = saleData as {
        id: string;
        quantity: number;
        priceUnit?: number;
        priceTotal?: number;
      };

      const sku = await SKUModel.findById(id);
      if (!sku) {
        throw new Error(`SKU not found for id: ${id}`);
      }

      const { priceUnit, quantity, priceTotal } = saleInfo;
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
        throw new Error(`Stock not sufficient for SKU: ${sku.name}`);
      }

      const profit = salesPriceTotal! - Number(sku.capitalPrice) * quantity;

      const sale = new SaleModel({
        skuId: new Types.ObjectId(id),
        priceUnit: Types.Decimal128.fromString(salesPriceUnit!.toString()),
        priceTotal: Types.Decimal128.fromString(salesPriceTotal!.toString()),
        profit: Types.Decimal128.fromString(profit.toString()),
        quantity,
      });

      createdSales.push(sale);
      updatedSkus.set(id, { sku, updatedStock });
    }

    // Second pass: save all sales and update SKUs
    try {
      // Save all sales
      await SaleModel.insertMany(createdSales);

      // Update all SKUs
      for (const [id, { sku, updatedStock }] of Array.from(
        updatedSkus.entries()
      )) {
        sku.stock = updatedStock;
        await sku.save();
      }
    } catch (error) {
      // If anything fails, we need to clean up any created sales
      if (createdSales.length > 0) {
        await SaleModel.deleteMany({
          _id: { $in: createdSales.map((sale) => sale._id) },
        });
      }
      throw error;
    }

    return NextResponse.json(createdSales);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'Error recording sales' },
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

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  try {
    await dbConnect();
    const { id } = data;
    const sale = await SaleModel.findById(id);
    if (!sale) {
      return Response.json(`Sale not found`, { status: 404 });
    }
    await sale.deleteOne();
    return Response.json('Sale is deleted');
  } catch (error) {
    return Response.json(`Error deleting SKU: ${error} `, { status: 500 });
  }
}
