"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function StatusAlert() {
  const handleScrollToContato = () => {
    const contato = document.getElementById("contato");
    if (contato) {
      contato.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-red-900/50 border border-red-400 text-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto mt-8 mb-12 text-center"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png"
          alt="Alerta"
          width={120}
          height={120}
          className="mx-auto"
        />

        <div className="text-left space-y-4">
          <h2 className="text-3xl font-bold text-yellow-300">
            Sua conta ainda não está ativa ⚠️
          </h2>
          <p className="text-lg text-gray-200">
            Isso pode significar que ela está aguardando aprovação ou foi temporariamente suspensa.
            Devido ao <strong>alto número de pedidos de novos sócios</strong>, o processo pode levar até <strong>72h úteis</strong>.
          </p>
          <p className="text-gray-300">
            Verifique seu email (inclusive a caixa de spam). Caso precise de ajuda, entre em contato com a equipe de suporte.
          </p>

          <button
            onClick={handleScrollToContato}
            className="mt-4 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
          >
            Falar com o Suporte
          </button>
        </div>
      </div>
    </motion.div>
  );
}
