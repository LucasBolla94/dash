"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  limit,
  query,
  where,
} from "firebase/firestore";
import UserCard from "./components/UserCard";
import StatusAlert from "./components/StatusAlert";
import FundValueCard from "./components/FundValueCard";
import BuySellButtons from "./components/BuySellButtons";
import PurchaseHistory from "./components/PurchaseHistory";
import VotingForm from "./components/VotingForm";
import VotingResults from "./components/VotingResults";
import ContactForm from "./components/ContactForm";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patrimonio, setPatrimonio] = useState<number | null>(null);
  const [compras, setCompras] = useState([]);
  const [votacaoAtiva, setVotacaoAtiva] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push("/");
        return;
      }

      setUser(currentUser);

      // Buscar dados do usuário (coleção socios)
      const docRef = doc(db, "socios", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }

      // Buscar patrimônio do fundo (coleção fund-wallet, último documento)
      const fundQuery = query(
        collection(db, "fund-wallet"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      const fundSnap = await getDocs(fundQuery);
      if (!fundSnap.empty) {
        const latest = fundSnap.docs[0].data();
        setPatrimonio(latest.total);
      }

      // Buscar compras do usuário (coleção compras)
      const comprasQuery = query(
        collection(db, "compras"),
        where("uid", "==", currentUser.uid)
      );
      const comprasSnap = await getDocs(comprasQuery);
      const listaCompras = comprasSnap.docs.map((doc) => doc.data());
      setCompras(listaCompras);

      // Buscar votação ativa (coleção votacoes)
      const votacaoQuery = query(
        collection(db, "votacoes"),
        where("status", "==", true),
        limit(1)
      );
      const votacaoSnap = await getDocs(votacaoQuery);
      if (!votacaoSnap.empty) {
        setVotacaoAtiva(votacaoSnap.docs[0]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center text-white">
        <p className="text-2xl animate-pulse">Carregando painel...</p>
      </div>
    );
  }

  const isActive = userData?.socio === true;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4 px-6 bg-white/10 rounded-xl shadow-xl mb-6">
        <h1 className="text-3xl font-bold text-yellow-300">Painel PRV</h1>
        <div className="space-x-4">
          <button
            onClick={() => router.push("/dash/buy")}
            className="bg-yellow-400 text-black px-5 py-2 rounded-xl font-bold hover:bg-yellow-300 transition"
          >
            Comprar
          </button>
          <a
            href="https://orca.so"
            target="_blank"
            className="bg-white text-purple-900 px-5 py-2 rounded-xl font-bold hover:bg-gray-100 transition"
          >
            Vender
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-400 transition"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Conta inativa */}
      {!isActive && <StatusAlert />}

      {/* Conteúdo do painel */}
      {isActive && (
        <>
          <UserCard user={userData} />
          <FundValueCard patrimonio={patrimonio} />
          <BuySellButtons />
          <PurchaseHistory compras={compras} />
          <VotingForm votacaoDoc={votacaoAtiva} user={user} />
          <VotingResults />
          <ContactForm user={user} />
        </>
      )}
    </main>
  );
}
