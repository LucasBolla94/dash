import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Erro no webhook Stripe:', err.message)
    } else {
      console.error('❌ Erro desconhecido no webhook Stripe')
    }

    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('✅ Pagamento confirmado para:', session.customer_email || session.id)

    // Em breve: enviar tokens PRV pra carteira
  }

  return NextResponse.json({ received: true })
}
