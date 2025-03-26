// src/app/dash/buy/page.tsx
"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "@/components/Navbar";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function BuyPage() {
  const [amountBRL, setAmountBRL] = useState(50);
  const [prvAmount, setPrvAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(5); // fallback
  const [loading, setLoading] = useState(false);

  const pricePerPRVUSD = 0.02;

  useEffect(() => {
    fetch("https://api.exchangerate.host/latest?base=USD&symbols=BRL")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && data.rates.BRL) {
          setExchangeRate(data.rates.BRL);
        }
      });
  }, []);

  useEffect(() => {
    const usd = amountBRL / exchangeRate;
    const tokens = usd / pricePerPRVUSD;
    setPrvAmount(Math.floor(tokens));
  }, [amountBRL, exchangeRate]);

  const handleCheckout = async () => {
    if (amountBRL < 50) {
      alert("Valor mínimo é R$50,00");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountBRL }),
    });

    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    if (stripe && sessionId) {
      await stripe.redirectToCheckout({ sessionId });
    } else {
      alert("Erro ao iniciar pagamento");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white px-4 py-6">
      <Navbar />
      <section className="max-w-md mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold">💳 Comprar $PRV</h1>
        <p className="text-white/70">Pagamento via Apple Pay, Google Pay ou Pix</p>

        <div className="bg-white/10 p-6 rounded-xl space-y-4 shadow-md">
          <p className="text-yellow-400 text-sm text-left">
            ⚠️ Os tokens serão depositados na <strong>carteira vinculada à sua conta</strong>. Caso queira alterar, volte e ajuste antes de finalizar a compra.
          </p>

          <label className="block text-left text-white/80 font-medium mb-1">
            Valor em Reais (R$) - Mínimo R$50
          </label>
          <input
            type="number"
            min={50}
            step={1}
            className="w-full p-3 rounded-xl text-black"
            value={amountBRL}
            onChange={(e) => setAmountBRL(Number(e.target.value))}
          />

          <p className="text-white/80 text-sm">
            💰 Você irá receber aproximadamente <strong>{prvAmount}</strong> tokens <span className="text-yellow-400">$PRV</span>
          </p>

          <button
            onClick={handleCheckout}
            className="bg-yellow-400 text-black py-3 px-6 rounded-xl font-bold text-lg hover:bg-yellow-300 transition"
            disabled={loading}
          >
            {loading ? "Redirecionando..." : "Pagar agora"}
          </button>

          <div className="text-white/60 text-sm pt-4 border-t border-white/20">
            ⏳ Após o pagamento, o envio dos tokens pode levar até <strong>6 horas</strong>. Isso ocorre porque precisamos converter o pagamento em reais para cripto e enviar seus $PRV na rede Solana. 🪄
            <br />
            Obrigado pela paciência e confiança! 🚀
          </div>
        </div>
      </section>
    </main>
  );
}
