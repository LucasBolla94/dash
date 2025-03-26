"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-xl px-4 py-3 rounded-b-2xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Painel</h1>

        {/* Botão Mobile para abrir/fechar menu */}
        <button
          className="sm:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? "✖️" : "☰"}
        </button>

        {/* Menu Desktop */}
        <div className="hidden sm:flex gap-6 text-lg font-medium">
          <Link href="/dash" className="hover:underline">🏠 Início</Link>
          <Link href="/dash/fundo" className="hover:underline">💰 Fundo</Link>
          <Link href="/dash/votacao" className="hover:underline">🗳️ Votação</Link>
          <Link href="/dash/contato" className="hover:underline">📞 Contato</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white font-bold transition"
          >
            🚪 Sair
          </button>
        </div>
      </div>

      {/* Menu Mobile com animação */}
      {menuOpen && (
        <div className="flex flex-col sm:hidden mt-4 gap-3 text-lg font-semibold animate-slide-down">
          <Link href="/dash" onClick={() => setMenuOpen(false)} className="bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-center">
            🏠 Início
          </Link>
          <Link href="/dash/fundo" onClick={() => setMenuOpen(false)} className="bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-center">
            💰 Fundo
          </Link>
          <Link href="/dash/votacao" onClick={() => setMenuOpen(false)} className="bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-center">
            🗳️ Votação
          </Link>
          <Link href="/dash/contato" onClick={() => setMenuOpen(false)} className="bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-center">
            📞 Contato
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl text-white font-bold mt-2"
          >
            🚪 Sair do Painel
          </button>
        </div>
      )}
    </nav>
  );
}
