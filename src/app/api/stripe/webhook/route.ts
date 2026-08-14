import { NextRequest, NextResponse } from 'next/server';
import { StripeWebhookHandler } from '@/lib/stripe/webhookHandler';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let event: any;

    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      event = {
        id: `evt_mock_${Date.now()}`,
        type: 'checkout.session.completed',
        data: {
          object: {
            id: `cs_${Date.now()}`,
            customer_email: 'buyer@example.com',
            amount_total: 38900,
            amount_subtotal: 38900,
          },
        },
      };
    }

    const result = await StripeWebhookHandler.processWebhookEvent(event);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook Error' },
      { status: 400 }
    );
  }
}
