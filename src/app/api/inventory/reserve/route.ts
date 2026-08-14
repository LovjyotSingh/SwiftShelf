import { NextRequest, NextResponse } from 'next/server';
import { StockReservationEngine } from '@/lib/redis/stockReservationEngine';
import { z } from 'zod';

const ReserveSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  userId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ReserveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { productId, variantId, quantity, userId } = parsed.data;

    const result = await StockReservationEngine.reserveStock(
      productId,
      variantId,
      quantity,
      userId || 'anonymous'
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 409 }); // 409 Conflict / Out of Stock
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
