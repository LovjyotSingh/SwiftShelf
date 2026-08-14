import { StockReservationEngine } from '../redis/stockReservationEngine';
import { OrderRecord } from '@/types';

// In-memory idempotency cache for fast replay attack detection
const processedEventIds = new Set<string>();
const completedOrders = new Map<string, OrderRecord>();

export class StripeWebhookHandler {
  /**
   * Process Stripe Webhook with Idempotency Protection
   */
  public static async processWebhookEvent(event: {
    id: string;
    type: string;
    data: { object: any };
  }): Promise<{ success: boolean; message: string; duplicate?: boolean }> {
    const eventId = event.id;

    // Step 1: Idempotency Check (Prevent duplicate charges / order fulfillment)
    if (processedEventIds.has(eventId)) {
      console.warn(`[Stripe Webhook] Duplicate event detected and safely skipped: ${eventId}`);
      return { success: true, message: 'Event already processed (idempotent)', duplicate: true };
    }

    processedEventIds.add(eventId);

    // Step 2: Handle Checkout Session Completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const idempotencyKey = metadata.idempotencyKey || `auto_${Date.now()}`;

      // Commit stock reservations if linked
      const reservationId = metadata.reservationId;
      if (reservationId) {
        await StockReservationEngine.commitReservation(reservationId);
      }

      // Create completed order entity
      const newOrder: OrderRecord = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderNumber: `SWIFT-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: metadata.customerName || 'Valued Customer',
        customerEmail: session.customer_email || session.customer_details?.email || 'customer@example.com',
        shippingAddress: metadata.shippingAddress ? JSON.parse(metadata.shippingAddress) : {
          street: '100 Silicon Way',
          city: 'San Francisco',
          state: 'CA',
          zip: '94107',
          country: 'USA',
        },
        items: [
          {
            productId: 'prod_01_spectre_pro',
            title: 'Spectre Pro ANC Headphones',
            variantName: 'Obsidian Black',
            quantity: 1,
            unitPrice: 389.0,
            totalPrice: 389.0,
          },
        ],
        subtotal: (session.amount_subtotal || 38900) / 100,
        discountAmount: 0,
        taxAmount: ((session.amount_total || 38900) / 100) * 0.08,
        shippingAmount: 0,
        total: (session.amount_total || 38900) / 100,
        status: 'PAID',
        paymentIntentId: session.payment_intent || `pi_mock_${Date.now()}`,
        idempotencyKey,
        createdAt: new Date().toISOString(),
      };

      completedOrders.set(newOrder.id, newOrder);
      console.log(`[Stripe Webhook] Order successfully finalized: ${newOrder.orderNumber}`);

      return { success: true, message: `Order ${newOrder.orderNumber} created` };
    }

    return { success: true, message: `Event ${event.type} received` };
  }

  public static getCompletedOrders(): OrderRecord[] {
    return Array.from(completedOrders.values());
  }
}
