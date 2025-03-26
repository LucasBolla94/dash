'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Navbar from '@/components/Navbar'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function BuyPage() {
  const [amountBRL, setAmountBRL] = useState(50)
  const [loading, setLoading] = useState(false)

  const pricePerPRVBRL = 0.13
  const prvAmount = Math.floor(amountBRL / pricePerPRVBRL)

  const handleCheckout = async () => {
    if (amountBRL < 50) {
      alert('Valor mínimo é R$50,00')
      return
    }

    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountBRL }),
    })

    const { sessionId } = await res.json()
    const stripe = await stripePromise
    if (stripe && sessionId) {
      await stripe.redirectToCheckout({ sessionId })
    } else {
      alert('Erro ao iniciar pagamento')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white px-4 py-6">
      <Navbar />
      <section className="max-w-md mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold">💳 Comprar $PRV</h1>
        <p className="text-white/70">Pagamento via Apple Pay, Google Pay ou Pix</p>

        <div className="bg-white/10 p-6 rounded-2xl space-y-6 shadow-xl">
          <p className="text-yellow-400 text-sm text-left">
            ⚠️ Os tokens serão depositados na <strong>carteira vinculada à sua conta</strong>. Caso queira alterar, volte e ajuste antes de finalizar a compra.
          </p>

          <label className="block text-left text-white/90 font-medium text-lg">
            Valor em Reais (R$) - Mínimo R$50
          </label>

          <input
            type="number"
            min={50}
            step={1}
            className="w-full p-4 rounded-xl bg-white text-black font-bold text-2xl text-center shadow-sm"
            value={amountBRL}
            onChange={(e) => setAmountBRL(Number(e.target.value))}
          />

          <p className="text-white/80 text-lg">
            💰 Você irá receber <strong className="text-yellow-300">{prvAmount}</strong> tokens <span className="text-yellow-400">$PRV</span>
          </p>

          <button
            onClick={handleCheckout}
            className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-xl hover:bg-yellow-300 transition"
            disabled={loading}
          >
            {loading ? 'Redirecionando...' : `Pagar R$${amountBRL.toFixed(2)}`}
          </button>

          <div className="text-white/60 text-sm pt-4 border-t border-white/20">
            ⏳ Após o pagamento, o envio dos tokens pode levar até <strong>6 horas</strong>. Isso ocorre porque precisamos converter o pagamento em reais para cripto e enviar seus $PRV na rede Solana.
            <br />
            Obrigado pela paciência e confiança! 🚀
          </div>
        </div>
      </section>
    </main>
  )
}
