// /src/app/dash/page.tsx - Dashboard Principal
"use client";
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import '@solana/wallet-adapter-react-ui/styles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PRV_TOKEN_MINT = 'BZB6XuKenzjF5mcmkqtbMg9922wT5RMwXjAXDREDk1YM';

export default function DashboardPage() {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [totalSocios, setTotalSocios] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [prvBalance, setPrvBalance] = useState(0);
  const [usdPrice, setUsdPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (!user) router.push('/');
    };

    checkAuth();
    fetchData();
    fetchTokenPrice();
  }, [router]);

  const fetchTokenPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      setUsdPrice(data.solana.usd);
    } catch (error) {
      console.error('Error fetching token price:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Total de sócios ativos
      const sociosQuery = query(collection(db, 'socios'), where('status', '==', true));
      const sociosSnapshot = await getDocs(sociosQuery);
      setTotalSocios(sociosSnapshot.size);

      // Último saldo do fundo
      const fundQuery = query(collection(db, 'fund-balance'), orderBy('date', 'desc'), limit(1));
      const fundSnapshot = await getDocs(fundQuery);
      const latestBalance = fundSnapshot.docs[0]?.data().balance || 0;
      setCurrentBalance(latestBalance);

      // Histórico do gráfico
      const historyQuery = query(collection(db, 'fund-balance'), orderBy('date', 'asc'));
      const historySnapshot = await getDocs(historyQuery);
      const data = historySnapshot.docs.map(doc => doc.data().balance);
      const dates = historySnapshot.docs.map(doc => 
        new Date(doc.data().date).toLocaleDateString('pt-BR')
      );
      
      setChartData(data);
      setLabels(dates);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTokenBalance = async () => {
    if (!publicKey) return;
    
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { mint: new PublicKey(PRV_TOKEN_MINT) }
      );

      if (tokenAccounts.value.length > 0) {
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        setPrvBalance(balance);
      }
    } catch (error) {
      console.error('Error checking token balance:', error);
    }
  };

  useEffect(() => {
    if (publicKey) {
      checkTokenBalance();
    }
  }, [publicKey]);

  const chartConfig = {
    labels,
    datasets: [
      {
        label: 'Saldo Total do Fundo (R$)',
        data: chartData,
        borderColor: 'rgb(250, 204, 21)',
        backgroundColor: 'rgba(250, 204, 21, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolução do Saldo Diário',
        font: {
          size: 18
        }
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: false,
        ticks: {
          callback: (tickValue: string | number) => {
            const value = typeof tickValue === 'number' 
              ? tickValue 
              : parseFloat(tickValue);
            return `R$ ${value.toLocaleString('pt-BR')}`;
          },
          font: {
            size: 14
          }
        },
      },
      x: {
        ticks: {
          font: {
            size: 14
          }
        }
      }
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4 sm:p-8"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.header 
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 text-center">
            🚀 Painel de Controle
          </h1>
          
          <div className="flex items-center gap-4">
            <WalletMultiButton className="!bg-yellow-400 !text-black !font-bold !px-6 !py-3 !rounded-xl hover:!bg-yellow-300" />
            <button 
              onClick={() => auth.signOut().then(() => router.push('/'))}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-transform hover:scale-105"
            >
              Sair
            </button>
          </div>
        </motion.header>

        {/* Saldo do Usuário */}
        {publicKey && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Seu Saldo PRV</h3>
                <p className="text-3xl font-semibold">
                  {prvBalance.toLocaleString('pt-BR')} PRV
                </p>
                <p className="text-lg text-gray-300 mt-2">
                  ≈ ${(prvBalance * usdPrice).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Valor do PRV</h3>
                <p className="text-3xl font-semibold">
                  ${usdPrice.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
                </p>
                <p className="text-lg text-gray-300 mt-2">Atualizado em tempo real</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dados Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Resumo do Fundo</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xl">Saldo Atual:</span>
                <span className="text-3xl font-bold">
                  R$ {currentBalance.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl">Sócios Ativos:</span>
                <span className="text-3xl font-bold">{totalSocios}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Ações Rápidas</h3>
            <div className="space-y-4">
              <a
                href="https://dex.orpca.com/pool"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-500 text-white text-center py-4 rounded-xl font-bold text-xl hover:bg-green-600 transition-transform hover:scale-105"
              >
                💰 Vender Participação
              </a>
            </div>
          </motion.div>
        </div>

        {/* Gráfico */}
        <motion.div 
          className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Line data={chartConfig} options={options} />
        </motion.div>

        {/* Seções Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Últimas Movimentações</h3>
            <div className="animate-pulse">
              {/* Implementar lista de movimentações */}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Estatísticas</h3>
            {/* Implementar estatísticas */}
          </motion.div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
        </div>
      )}
    </motion.div>
  );
}