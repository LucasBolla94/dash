import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amountBRL, uid, email, walletAddress } = body;

    console.log("🧾 Recebido amountBRL:", amountBRL);

    if (!amountBRL || amountBRL < 50) {
      console.warn("❗ Valor inválido recebido:", amountBRL);
      return NextResponse.json({ error: "Valor mínimo é R$50" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
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
      metadata: {
        uid,
        email,
        walletAddress,
        valor: amountBRL.toString(),
      },
      success_url: "https://app.primereserv.online/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://app.primereserv.online/cancelado",
    });

    console.log("✅ Sessão criada:", session.id);
    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Erro na criação da sessão Stripe:", error.message);
    } else {
      console.error("❌ Erro desconhecido:", error);
    }

    return NextResponse.json({ error: "Erro ao criar sessão de pagamento" }, { status: 500 });
  }
}
