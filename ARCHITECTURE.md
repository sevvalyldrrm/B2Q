# B2Q — Proje Mimarisi

> Son güncelleme: Nisan 2026

---

## 🗂 Klasör Yapısı

```
B2Q/
├── docker-compose.yml          # Redis + RabbitMQ servisleri
├── requirements.txt            # Python bağımlılıkları
├── ARCHITECTURE.md             # Bu dosya
└── b2q/
    ├── provider/               # Veri kaynakları
    │   ├── binance_provider.py     # REST API (geçmiş mum verisi)
    │   ├── binance_ws_provider.py  # WebSocket (canlı mum verisi)
    │   └── redis_client.py         # Redis okuma/yazma
    │
    ├── quantum_engine/         # Analiz motoru (bu projenin kalbi)
    │   ├── analyzer.py             # ATR, RSI, EMA hesaplama
    │   ├── quantum_circuit.py      # Qubit encode, measure, entangle
    │   └── decision_engine.py      # Klasik + Qubit → nihai karar
    │
    ├── event_bus/              # Mesajlaşma katmanı (RabbitMQ)
    │   ├── publisher.py            # Event yayınlama
    │   └── subscriber.py           # Event dinleme
    │
    ├── nlp/                    # Doğal dil işleme (ileride)
    │
    ├── webapi/
    │   └── main.py             # FastAPI endpoint'leri
    │
    └── web/                    # React frontend
        └── src/
            ├── pages/
            │   └── Quantum.jsx
            ├── components/quantum/
            │   ├── CircuitActivity.jsx   # Ana panel (karar göstergesi)
            │   ├── GateFidelity.jsx
            │   ├── IterationLog.jsx
            │   └── DecoherenceProfile.jsx
            └── services/
                └── api.js              # Backend bağlantısı
```

---

## 🔄 Genel Veri Akışı

```
Binance API (REST)
      ↓
  seed_redis()          → 500 geçmiş mum Redis'e yüklenir (startup)
      ↓
   Redis Cache
      ↓
GET /quantum/analyze
      ↓
  QuantumAnalyzer.analyze()
      ↓
  ┌─────────────────────────────────────────┐
  │           quantum_engine                │
  │                                         │
  │  ATR  (Wilder smoothed) → 0-100        │
  │  RSI  (Wilder smoothed) → 0-100        │
  │  EMA20/EMA50 oranı      → 0-100        │
  │           ↓                             │
  │  quantum_score (ağırlıklı ort.)         │
  │  classic_signal: BUY/SELL/HOLD         │
  │           ↓                             │
  │  quantum_circuit.py                     │
  │  encode → measure → entangle           │
  │  joint_prob → circuit_signal           │
  │           ↓                             │
  │  decision_engine.py                     │
  │  classic + circuit → final_decision    │
  └─────────────────────────────────────────┘
      ↓
  EventBus → "QUANTUM_ANALYZED" eventi
      ↓
  JSON response → Frontend
```

---

## ⚛️ Quantum Engine — Detay

### Katman 1: `analyzer.py`

| Metod | Algoritma | Çıktı |
|---|---|---|
| `_volatility_score()` | Wilder ATR (14 periyot) | 0-100 |
| `_momentum_score()` | Wilder RSI (14 periyot) | 0-100 |
| `_trend_score()` | EMA20 / EMA50 oranı | 0-100 |
| `_signal()` | Eşik kuralları | BUY / SELL / HOLD |

**quantum_score formülü:**
```
quantum_score = ATR×0.30 + RSI×0.40 + EMA×0.30
```

**Klasik sinyal kuralları:**
```
quantum ≥ 65 AND momentum ≥ 60 AND trend ≥ 55  →  BUY
quantum ≤ 35 OR  momentum ≤ 30 OR  trend ≤ 25  →  SELL
diğer                                           →  HOLD
```

---

### Katman 2: `quantum_circuit.py`

**Qubit Encoding:**
```
score (0-100)  →  θ = (score / 100) × (π/2)

score = 0   →  θ = 0     →  |0⟩  (tamamen bearish)
score = 50  →  θ = π/4   →  süperpozisyon
score = 100 →  θ = π/2   →  |1⟩  (tamamen bullish)
```

İndikatörden gelen 0-100 arası sayıyı, qubit'in "ne kadar bullish olduğunu" temsil eden bir açıya (θ) dönüştürürüz. Açı küçükse qubit bearish bölgede, büyükse bullish bölgededir.

**Ölçüm (Measurement):**
```
Qubit durumu  :  cos(θ)|0⟩ + sin(θ)|1⟩
P(|1⟩) = sin²(θ)   ← bullish olasılığı
P(|0⟩) = cos²(θ)   ← bearish olasılığı

P(|1⟩) + P(|0⟩) = 1  ✅
```

Qubit'i "ölçtüğümüzde" iki sonuç olabilir: |1⟩ (bullish) ya da |0⟩ (bearish). Bullish çıkma olasılığı sin²(θ) formülüyle hesaplanır. İki olasılık toplamı her zaman 1'dir.

**Dolanıklık (Entanglement):**
```
joint_prob = sin²(θ_RSI) × sin²(θ_ATR) × sin²(θ_EMA)

joint ≥ 0.40  →  BUY   (üçü birden güçlü)
joint ≤ 0.08  →  SELL  (en az biri çok zayıf)
arası         →  HOLD
```

Üç qubit'i "dolanık" hale getiriyoruz: üçünün aynı anda bullish olma olasılığını çarparak buluyoruz. Klasik sistemde zayıf bir indikatör ortalama içinde kaybolabilir; burada ise tek zayıf halka tüm joint_prob'u aşağı çeker.

**Sinyal Üretimi:**

`quantum_signal()` fonksiyonu RSI, ATR ve EMA skorlarını alır; üçünü ayrı ayrı qubit'e encode eder, her birini ölçer, sonra dolanık joint_prob hesaplar. Sonuç olarak şu bilgileri döner:

| Alan | Açıklama |
|---|---|
| `q1_prob` | RSI qubit bullish olasılığı |
| `q2_prob` | ATR qubit bullish olasılığı |
| `q3_prob` | EMA qubit bullish olasılığı |
| `joint_prob` | Üçünün aynı anda bullish olma olasılığı |
| `confidence` | joint_prob'un 0-100 skalasına çevrilmiş hali |
| `signal` | BUY / SELL / HOLD |

> ⚠️ **Kritik fark:** Klasik sistem skorları **toplar** → zayıf halka ortalamayla gizlenir.
> Qubit sistemi **çarpar** → zayıf halka tüm joint_prob'u düşürür.

---

### Katman 3: `decision_engine.py`

**Karar Matrisi (9 kombinasyon):**

| Klasik | Qubit | Final Karar | Score |
|---|---|---|---|
| BUY | BUY | **STRONG_BUY** | +2 |
| BUY | HOLD | **BUY** | +1 |
| BUY | SELL | **HOLD** | 0 ⚠️ çelişki |
| HOLD | BUY | **HOLD** | 0 |
| HOLD | HOLD | **HOLD** | 0 |
| HOLD | SELL | **WEAK_SELL** | -1 |
| SELL | BUY | **HOLD** | 0 ⚠️ çelişki |
| SELL | HOLD | **SELL** | -1 |
| SELL | SELL | **STRONG_SELL** | -2 |

---

## 🌐 API Endpoint'leri

| Method | URL | Açıklama |
|---|---|---|
| GET | `/` | Sağlık kontrolü |
| GET | `/quantum/analyze` | Ana analiz endpoint'i |
| GET | `/redis/latest` | Son mumu döner |
| GET | `/redis/history` | Geçmiş mumları döner |
| WS | `/ws/klines` | Canlı mum stream'i |

**Örnek istek:**
```
GET http://localhost:8000/quantum/analyze?symbol=btcusdt&interval=1h&limit=100
```

**Örnek yanıt:**
```json
{
  "symbol": "BTCUSDT",
  "interval": "1h",
  "candle_count": 100,
  "latest_close": 68284.48,
  "volatility_score": 16.94,
  "momentum_score": 52.47,
  "trend_score": 64.55,
  "quantum_score": 45.44,
  "signal": "HOLD",
  "circuit": {
    "q1_rsi_prob": 0.5388,
    "q2_atr_prob": 0.0692,
    "q3_ema_prob": 0.7207,
    "joint_prob": 0.0269,
    "confidence": 2.69,
    "signal": "SELL"
  },
  "decision": {
    "final_decision": "WEAK_SELL",
    "decision_score": -1,
    "reason": "Klasik notr ama qubit zayıf → temkinli satış eğilimi.",
    "agreement": false,
    "classic_signal": "HOLD",
    "circuit_signal": "SELL",
    "confidence": 2.69,
    "quantum_score": 45.44
  }
}
```

---

## 🖥 Frontend — CircuitActivity Paneli

```
┌──────────────────────────────────────────────────────┐
│  ● Quantum Circuit Activity :: Real-time Stream       │
│                                                        │
│                  Final Decision                        │
│                 [ WEAK_SELL ]  ← renkli border        │
│                                                        │
│     RSI  ████████░░░  54%  (mavi)                     │
│     ATR  █░░░░░░░░░░   7%  (kırmızı ← zayıf halka)   │
│     EMA  ████████████  72%  (yeşil)                   │
│                                                        │
│     "Klasik notr ama qubit zayıf →                    │
│      temkinli satış eğilimi."                          │
│                                                        │
│  TARGET: BTC/USDT │ CLASSIC: HOLD │ QUBIT: SELL       │
│  AGREE: ✗         │ CONFIDENCE: 2.69%                 │
└──────────────────────────────────────────────────────┘
```

**Renk kodlaması:**

| Karar | Renk |
|---|---|
| STRONG_BUY / BUY | 🟢 Jade yeşili |
| HOLD | 🔵 Cyan |
| WEAK_SELL / SELL | 🔴 Magenta |
| STRONG_SELL | 🔴 Magenta (parlak) |

---

## 🚀 Sistemi Başlatma

```zsh
# 1. Docker servisleri (Redis + RabbitMQ)
cd /Users/sevvalyildirim/B2Q
docker-compose up -d

# 2. FastAPI backend
uvicorn b2q.webapi.main:app --reload --host 0.0.0.0 --port 8000

# 3. React frontend
cd b2q/web
npm run dev
# → http://localhost:5173
```

---

## 📦 Teknoloji Stack

| Katman | Teknoloji |
|---|---|
| Veri kaynağı | Binance REST + WebSocket API |
| Cache | Redis |
| Mesajlaşma | RabbitMQ (AMQP) |
| Backend | Python / FastAPI |
| Analiz | Saf Python (numpy yok) |
| Frontend | React + Vite + TailwindCSS |
| Konteyner | Docker Compose |