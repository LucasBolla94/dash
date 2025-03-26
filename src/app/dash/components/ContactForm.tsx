"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";

interface Props {
  user: {
    uid: string;
    email: string;
  };
  userData: {
    nome: string;
    sobrenome: string;
  };
}

export default function ContactForm({ user, userData }: Props) {
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState<"idle" | "enviando" | "enviado" | "erro">("idle");

  // Obter apenas o primeiro nome do userData.nome
  const primeiroNome = userData?.nome?.split(" ")[0] || "Usuário";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("enviando");

    try {
      await addDoc(collection(db, "mensagens"), {
        uid: user.uid,
        email: user.email,
        nome: primeiroNome,
        mensagem,
        data: serverTimestamp(),
      });

      setMensagem("");
      setStatus("enviado");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setStatus("erro");
    }
  };

  return (
    <motion.div
      id="contato"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 rounded-2xl shadow-md p-6 max-w-2xl mx-auto mt-12 mb-20"
    >
      <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
        <SendHorizonal size={24} />
        Fale com o Suporte
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-yellow-400 font-semibold mb-1">
            Nome
          </label>
          <input
            type="text"
            value={primeiroNome}
            disabled
            className="w-full bg-white/20 text-white px-4 py-3 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full bg-white/20 text-white px-4 py-3 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">
            Mensagem
          </label>
          <textarea
            required
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Descreva sua dúvida ou solicitação..."
            rows={5}
            className="w-full bg-white/20 text-white px-4 py-3 rounded-xl resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === "enviando" || !mensagem}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold text-lg hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {status === "enviando" ? "Enviando..." : "Enviar Mensagem"}
        </button>

        {status === "enviado" && (
          <p className="text-green-400 text-center mt-2 font-semibold">
            Mensagem enviada com sucesso!
          </p>
        )}
        {status === "erro" && (
          <p className="text-red-400 text-center mt-2 font-semibold">
            Ocorreu um erro ao enviar sua mensagem.
          </p>
        )}
      </form>
    </motion.div>
  );
}
