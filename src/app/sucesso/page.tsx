'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, XCircle, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          setStatus('error')
          return
        }

        const res = await fetch(`/api/verify?session_id=${sessionId}`)
        const data = await res.json()

        if (data.success) {
          setStatus('success')
          setShowConfetti(true)

          setTimeout(() => {
            setShowConfetti(false)
          }, 8000)
        } else {
          setStatus('error')
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err)
        setStatus('error')
      }
    }

    verifyPayment()
  }, [sessionId])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white px-4 py-10 flex items-center justify-center relative overflow-hidden">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 p-8 rounded-2xl shadow-2xl max-w-md text-center space-y-6"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto w-16 h-16 animate-spin text-yellow-300" />
            <p className="text-white/80">Verificando pagamento...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <PartyPopper className="text-green-400 mx-auto w-16 h-16 animate-bounce" />
            <h1 className="text-3xl font-extrabold text-yellow-400">Compra concluída com sucesso! 🎉</h1>
            <p className="text-white/90">
              Seus <span className="text-yellow-300 font-semibold">$PRV</span> estão a caminho da sua carteira.
            </p>
            <p className="text-white/60 text-sm">
              A entrega pode levar até <strong>6 horas</strong>. Fique de olho na sua carteira Solana.
            </p>
            <Link
              href="/dash"
              className="inline-flex items-center gap-2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all hover:scale-105"
            >
              <CheckCircle className="w-5 h-5" />
              Voltar ao Painel
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="text-red-400 mx-auto w-16 h-16" />
            <h1 className="text-2xl font-bold">Erro na confirmação</h1>
            <p className="text-white/70">
              Não foi possível verificar o pagamento. Se já foi cobrado, entre em contato com o suporte.
            </p>
            <Link
              href="/dash"
              className="inline-block mt-4 bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Voltar ao Painel
            </Link>
          </>
        )}
      </motion.div>
    </main>
  )
}
