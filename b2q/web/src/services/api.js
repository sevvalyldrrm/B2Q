import { mockStrategyData, mockAgentHubData, mockVaultData, mockQuantumData } from '../data/mockData';

// Backend (FastAPI) Adreslerimiz
const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000';

export const api = {
  // Kuantum Analiz Verisini Çeker (REST API)
  getQuantumData: async (symbol = 'btcusdt', interval = '1h') => {
    try {
      const response = await fetch(`${API_BASE_URL}/quantum/analyze?symbol=${symbol}&interval=${interval}&limit=100`);
      if (!response.ok) throw new Error('API yanıt vermedi');
      
      const data = await response.json();
      
      // Eğer backend hata dönerse (örn: yeterli veri yoksa) mock veriyi göster
      if (data.error) {
        console.warn("Backend uyarısı:", data.error);
        return mockQuantumData;
      }

      // Backend'den gelen gerçek skorları UI'a uygun formata çeviriyoruz
      return {
        ...mockQuantumData, // UI bozulmasın diye diğer grafikleri mock'tan alıyoruz
        realScores: {
          quantumScore: data.quantum_score,
          trendScore: data.trend_score,
          momentumScore: data.momentum_score,
          volatilityScore: data.volatility_score,
          signal: data.signal,
          latestClose: data.latest_close
        }
      };
    } catch (error) {
      console.error("Quantum API Hatası, Mock veriye dönülüyor...", error);
      return mockQuantumData;
    }
  },

  // Canlı Fiyat Verilerini Dinler (WebSocket)
  subscribeToUpdates: (callback, symbol = 'btcusdt', interval = '1m') => {
    const ws = new WebSocket(`${WS_BASE_URL}/ws/klines?symbol=${symbol}&interval=${interval}`);

    ws.onopen = () => {
      console.log("🟢 WebSocket Bağlandı! Binance canlı verileri akıyor...");
    };

    ws.onmessage = (event) => {
      const candle = JSON.parse(event.data);
      
      callback({
        type: 'market_update',
        timestamp: candle.closeTime,
        data: {
          currentPrice: candle.closePrice,
          isClosed: candle.isClosed,
          symbol: symbol
        }
      });
    };

    ws.onerror = (error) => {
      console.error("🔴 WebSocket Hatası:", error);
    };

    // Component kapandığında bağlantıyı temizlemek için fonksiyon dönüyoruz
    return () => {
      console.log("WebSocket bağlantısı kapatılıyor...");
      ws.close();
    };
  },

  // --------------------------------------------------------
  // 🟡 2. ŞİMDİLİK MOCK (SAHTE) KALACAK OLANLAR
  // --------------------------------------------------------
  getSummaryData: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStrategyData.summaryCards;
  },
  getRiskChartData: async () => mockStrategyData.riskChart,
  getAgentsData: async () => mockStrategyData.agents,
  getOrderHistory: async () => mockStrategyData.orderHistory || [],
  getAllStrategyData: async () => mockStrategyData,
  getAgentHubData: async () => mockAgentHubData,
  getVaultData: async () => mockVaultData,
  deployAgent: async () => ({ success: true, agentId: `agent_${Date.now()}` })
};