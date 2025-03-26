"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { Vote } from "lucide-react";

interface Props {
  votacaoDoc: any;
  user: {
    uid: string;
    email: string;
    displayName?: string;
  };
}

export default function VotingForm({ votacaoDoc, user }: Props) {
  const [votoFeito, setVotoFeito] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const votacaoId = votacaoDoc?.id;

  useEffect(() => {
    const verificarVoto = async () => {
      if (!votacaoId || !user?.uid) return;

      const votoRef = doc(db, "votacoes", votacaoId, "votos", user.uid);
      const votoSnap = await getDoc(votoRef);

      if (votoSnap.exists()) {
        setVotoFeito(votoSnap.data().voto);
      }
    };

    verificarVoto();
  }, [votacaoId, user]);

  const handleVotar = async (opcao: string) => {
    if (votoFeito || enviando) return;
    setEnviando(true);

    try {
      const votoRef = doc(db, "votacoes", votacaoId, "votos", user.uid);
      await setDoc(votoRef, {
        uid: user.uid,
        nome: user.displayName || "Usuário",
        email: user.email,
        voto: opcao,
        data: Timestamp.now(),
      });

      setVotoFeito(opcao);
    } catch (err) {
      console.error("Erro ao votar:", err);
    } finally {
      setEnviando(false);
    }
  };

  if (!votacaoDoc) return null;

  const votacao = votacaoDoc.data();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-white/10 rounded-2xl shadow-md p-6 max-w-3xl mx-auto mb-6"
    >
      <h2 className="text-2xl font-bold text-yellow-300 mb-2 flex items-center gap-2">
        <Vote size={24} />
        Votação Ativa
      </h2>
      <p className="text-white text-lg font-semibold mb-1">{votacao.titulo}</p>
      <p className="text-gray-300 mb-4">{votacao.descricao}</p>

      {votoFeito ? (
        <div className="text-center text-green-400 font-bold text-lg">
          ✅ Você votou:{" "}
          {votoFeito === "sim"
            ? "Sim"
            : votoFeito === "nao"
            ? "Não"
            : "Anular Voto"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleVotar("sim")}
            className="bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-bold transition"
            disabled={enviando}
          >
            ✅ Sim
          </button>
          <button
            onClick={() => handleVotar("nao")}
            className="bg-red-500 hover:bg-red-400 text-white py-3 rounded-xl font-bold transition"
            disabled={enviando}
          >
            ❌ Não
          </button>
          <button
            onClick={() => handleVotar("anular")}
            className="bg-gray-400 hover:bg-gray-300 text-white py-3 rounded-xl font-bold transition"
            disabled={enviando}
          >
            ⚪ Anular Voto
          </button>
        </div>
      )}
    </motion.div>
  );
}
