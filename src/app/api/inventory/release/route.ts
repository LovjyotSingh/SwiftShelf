import { NextRequest, NextResponse } from 'next/server';
import { StockReservationEngine } from '@/lib/redis/stockReservationEngine';
import { z } from 'zod';

const ReleaseSchema = z.object({
  reservationId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ReleaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid reservationId parameter' },
        { status: 400 }
      );
    }

    const released = await StockReservationEngine.releaseReservation(parsed.data.reservationId);

    return NextResponse.json({ success: released, reservationId: parsed.data.reservationId });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
