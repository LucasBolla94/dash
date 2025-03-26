// src/app/sucesso/page.tsx
'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white px-4 py-10 flex items-center justify-center">
      <div className="bg-white/10 p-8 rounded-2xl shadow-xl max-w-md text-center space-y-6">
        <CheckCircle className="text-green-400 mx-auto w-16 h-16" />
        <h1 className="text-3xl font-bold">Pagamento confirmado! ✅</h1>
        <p className="text-white/80">
          Obrigado pela sua compra! Em breve seus <span className="text-yellow-300 font-semibold">$PRV</span> serão enviados para sua carteira vinculada.
        </p>
        <p className="text-white/60 text-sm">
          A entrega dos tokens pode levar até <strong>6 horas</strong>. Se tiver dúvidas, entre em contato conosco.
        </p>

        <Link href="/dash" className="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-300 transition">
          Voltar ao Painel
        </Link>
      </div>
    </main>
  )
}
