import { stripe } from "../../utils/stripe";
import { prisma } from "../../utils/prisma";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import Stripe from "stripe";

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  status: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  createdAt: Date;
}

export const createPaymentIntent = async (
  userId: string,
  eventId: string
): Promise<PaymentIntent> => {
  // Get event details
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      price: true,
      maxParticipants: true,
      _count: {
        select: {
          participants: true,
        },
      },
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  // Check if event requires payment
  if (event.price <= 0) {
    throw new BadRequestError("This event is free and does not require payment");
  }

  // Check if event is full
  if (event._count.participants >= event.maxParticipants) {
    throw new BadRequestError("Event is already full");
  }

  // Check if user already joined
  const existingParticipant = await prisma.participant.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });

  if (existingParticipant) {
    throw new BadRequestError("You have already joined this event");
  }

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(event.price * 100), // Convert to cents
    currency: "usd",
    metadata: {
      userId,
      eventId,
      eventName: event.title,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
    amount: event.price,
  };
};

export const handleWebhook = async (
  stripeSignature: string,
  rawBody: Buffer
): Promise<void> => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      webhookSecret
    );
  } catch (err: any) {
    throw new BadRequestError(`Webhook signature verification failed: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { userId, eventId } = paymentIntent.metadata;

      if (userId && eventId) {
        // Create or update participant with COMPLETED payment status
        await prisma.participant.upsert({
          where: {
            userId_eventId: {
              userId,
              eventId,
            },
          },
          create: {
            userId,
            eventId,
            paymentStatus: "COMPLETED",
            paymentIntentId: paymentIntent.id,
            amountPaid: paymentIntent.amount / 100, // Convert from cents
          },
          update: {
            paymentStatus: "COMPLETED",
            paymentIntentId: paymentIntent.id,
            amountPaid: paymentIntent.amount / 100,
          },
        });

        // Check if event is now full and update status
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          select: {
            maxParticipants: true,
            _count: {
              select: {
                participants: true,
              },
            },
          },
        });

        if (event && event._count.participants >= event.maxParticipants) {
          await prisma.event.update({
            where: { id: eventId },
            data: { status: "FULL" },
          });
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { userId, eventId } = paymentIntent.metadata;

      if (userId && eventId) {
        // Update participant payment status to FAILED
        await prisma.participant.updateMany({
          where: {
            userId,
            eventId,
            paymentIntentId: paymentIntent.id,
          },
          data: {
            paymentStatus: "FAILED",
          },
        });
      }
      break;
    }

    default:
      // Unhandled event type - could be logged to monitoring service in production
      if (process.env.NODE_ENV !== "production") {
        console.log(`Unhandled event type: ${event.type}`);
      }
  }
};

export const getPaymentHistory = async (userId: string): Promise<PaymentHistory[]> => {
  const participants = await prisma.participant.findMany({
    where: {
      userId,
      paymentStatus: {
        in: ["COMPLETED", "PENDING", "FAILED"],
      },
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          date: true,
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  return participants.map((p) => ({
    id: p.id,
    amount: p.amountPaid || 0,
    status: p.paymentStatus || "PENDING",
    eventId: p.event.id,
    eventName: p.event.title,
    eventDate: p.event.date,
    createdAt: p.joinedAt,
  }));
};
