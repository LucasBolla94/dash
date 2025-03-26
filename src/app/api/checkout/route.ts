// src/app/api/checkout/route.ts
import { db } from "@/lib/firebase";
import { Timestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuth } from "firebase-admin/auth";
import { getApps, initializeApp, applicationDefault } from "firebase-admin/app";

// Inicializa Firebase Admin apenas uma vez
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function POST(req: NextRequest) {
  try {
    const { amountBRL } = await req.json();
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verifica token do Firebase
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email || "sem-email";

    if (amountBRL < 50) {
      return NextResponse.json({ error: "Valor mínimo é R$50,00" }, { status: 400 });
    }

    // Busca a carteira do Firestore (opcional se não estiver no token)
    let wallet = "carteira-nao-encontrada";
    const userDoc = await getDoc(doc(db, "socios", uid));
    if (userDoc.exists()) {
      wallet = userDoc.data().wallet || wallet;
    }

    // Cria sessão Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Compra de $PRV - PrimeReserv",
            },
            unit_amount: amountBRL * 100, // centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dash/compra-sucesso`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dash/buy`,
      metadata: {
        uid,
        email,
        wallet,
        valor: amountBRL,
      },
    });

    // Salva registro inicial no Firestore
    const registroRef = doc(db, "pagamentos", session.id);
    await setDoc(registroRef, {
      uid,
      email,
      valor: amountBRL,
      wallet,
      pago: false,
      criadoEm: Timestamp.now(),
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
