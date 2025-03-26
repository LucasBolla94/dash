// src/app/api/stripe-webhook/route.ts
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Erro ao verificar webhook:", err);
    return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`, { status: 400 });
  }

  // Processa evento de pagamento
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const pagamentoRef = doc(db, "pagamentos", session.id);
    await updateDoc(pagamentoRef, {
      pago: true,
      pagoEm: new Date(),
    });

    console.log("✅ Pagamento confirmado para:", session.metadata?.email);
  }

  return new NextResponse("ok", { status: 200 });
}

export const config = {
  api: {
    bodyParser: false, // Stripe exige o corpo bruto
  },
};