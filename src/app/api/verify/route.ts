import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { adminDB } from '@/lib/firebase-admin'
import { doc, getDoc, setDoc } from 'firebase-admin/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get('session_id')

  if (!session_id) {
    return NextResponse.json({ success: false, error: 'session_id ausente' }, { status: 400 })
  }

  try {
    // 1. Busca a sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Pagamento não confirmado' }, { status: 400 })
    }

    const metadata = session.metadata

    if (!metadata?.uid || !metadata?.email || !metadata?.walletAddress || !metadata?.valor) {
      return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 })
    }

    // 2. Prevenir duplicação
    const ref = doc(adminDB, 'compras', session_id)
    const docSnap = await getDoc(ref)

    if (!docSnap.exists) {
      await setDoc(ref, {
        uid: metadata.uid,
        email: metadata.email,
        walletAddress: metadata.walletAddress,
        valor: Number(metadata.valor),
        createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ Erro ao verificar pagamento:', err)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
