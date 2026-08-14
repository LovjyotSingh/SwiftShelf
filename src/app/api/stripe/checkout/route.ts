import { NextRequest, NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe/stripeClient';
import { z } from 'zod';

const CheckoutPayloadSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      title: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
      image: z.string(),
      reservationId: z.string().optional(),
    })
  ),
  customerEmail: z.string().email(),
  customerName: z.string(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid checkout parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await createStripeCheckoutSession(parsed.data, appUrl);

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Stripe Checkout Error' },
      { status: 500 }
    );
  }
}
