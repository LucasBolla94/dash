// src/app/api/checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { amountBRL } = await req.json();

  if (!amountBRL || amountBRL < 50) {
    return NextResponse.json({ error: "Valor mínimo é R$50" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["pix"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "$PRV Token",
              description: "Compra de tokens $PRV com valor fixo em reais",
            },
            unit_amount: Math.round(amountBRL * 100),
          },
          quantity: 1,
        },
      ],
      success_url: "https://primereserv.online/sucesso",
      cancel_url: "https://primereserv.online/cancelado",
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Erro na criação da sessão:", error.message);
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento" }, { status: 500 });
  }
}
