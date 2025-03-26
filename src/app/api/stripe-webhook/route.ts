// src/app/api/stripe-webhook/route.ts
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// 🔐 Stripe precisa da chave secreta e da secret do webhook
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !webhookSecret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Erro ao verificar assinatura do webhook:", err);
    return new NextResponse("Webhook signature verification failed", { status: 400 });
  }

  // Trata o evento de pagamento
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;

    try {
      const pagamentoRef = doc(db, "pagamentos", sessionId);
      await updateDoc(pagamentoRef, {
        pago: true,
        confirmadoEm: new Date(),
      });

      console.log("✅ Pagamento confirmado:", sessionId);
    } catch (err) {
      console.error("Erro ao atualizar pagamento no Firestore:", err);
      return new NextResponse("Erro ao atualizar pagamento", { status: 500 });
    }
  }

  return new NextResponse("Webhook recebido", { status: 200 });
}
