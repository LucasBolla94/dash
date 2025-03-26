// src/app/dash/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const [userData, setUserData] = useState<{
    nome: string;
    email: string;
    socioTime: string;
    socio: boolean;
  } | null>(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [userAllowed, setUserAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "socios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.socio) {
            setUserData({
              nome: data.nome || "Sócio",
              email: user.email || "",
              socioTime: data["socio-time"] || "Desconhecida",
              socio: true,
            });
            setUserAllowed(true);
          } else {
            setUserAllowed(false);
          }
        } else {
          setUserAllowed(false);
        }
      } else {
        setUserAllowed(false);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white px-4 py-6">
      <Navbar />

      <section className="max-w-md mx-auto text-center">
        {!authChecked ? (
          <p className="text-yellow-300 animate-pulse">Carregando dados do sócio...</p>
        ) : userAllowed ? (
          <>
            <h1 className="text-3xl font-bold mb-4">🎉 Bem-vindo, {userData?.nome}</h1>
            <p className="text-lg text-white/80 mb-2">📧 {userData?.email}</p>
            <p className="text-md text-white/60 mb-1">📆 Sócio desde: {userData?.socioTime}</p>
            <p className="text-green-400 mb-6 font-medium">✅ Status: Sócio Ativo</p>

            <div className="text-left bg-white/10 backdrop-blur-md rounded-xl p-4 text-sm text-white/80 mb-6 shadow-md">
              <p className="mb-2 font-semibold text-yellow-400">📌 Orientações iniciais:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Você agora faz parte do fundo PrimeReserv</li>
                <li>Utilize os botões abaixo para investir ou retirar</li>
                <li>Em caso de dúvida, vá em <strong>Contato</strong> na navbar</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/dash/buy"
                className="bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition text-center"
              >
                Comprar
              </Link>
              <a
                href="https://orca.so"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 text-white py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition text-center"
              >
                Vender
              </a>
            </div>
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md border border-yellow-400 rounded-xl p-6 shadow-lg animate-fade-in space-y-4">
            <h2 className="text-xl font-bold text-yellow-300">⏳ Aguardando Aprovação</h2>
            <p className="text-white/90 text-sm">
              Seu cadastro foi recebido com sucesso e está em análise.
            </p>
            <p className="text-white/70 text-sm">
              📩 Em breve você poderá acessar sua conta de sócio e investir com nosso token exclusivo <strong>$PRV</strong>.
            </p>
            <p className="text-white/70 text-sm">
              🚀 Devido ao alto número de cadastros, a aprovação pode levar até <strong>24 horas</strong>. Fique de olho no seu e-mail!
            </p>
            <p className="text-white/60 text-xs italic">
              Estamos felizes com seu interesse no fundo PrimeReserv. Quanto antes for aprovado, antes poderá garantir seus tokens!
            </p>

            <div className="mt-4">
              <p className="text-sm text-white/80 mb-2">❓ Tem dúvidas ou precisa de ajuda com seu cadastro?</p>
              <a
                href="https://wa.me/447432009032"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-5 rounded-xl text-sm transition"
              >
                💬 Falar com o Suporte no WhatsApp
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
