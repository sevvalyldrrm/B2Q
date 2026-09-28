# B2Q

B2Q is a market analysis project with a FastAPI backend, a React/Vite frontend, and Redis and RabbitMQ services. The backend loads historical Binance candles into Redis and provides analysis and indicator endpoints.

## Prerequisites

- Windows with PowerShell
- Python 3.10 or newer
- Node.js 20.19+ or 22.12+
- Docker Desktop with Docker Compose enabled
- Internet access for the backend to download public market data from Binance

No Binance API key is required for the public candle data used during startup.

## Project Layout

Run the commands below from the repository root: the directory containing `docker-compose.yml` and `requirements.txt`.

```text
repository-root/
|-- docker-compose.yml
|-- requirements.txt
|-- b2q/
	|-- web/       React/Vite frontend
	|-- webapi/    FastAPI application
	|-- provider/  Binance and Redis integrations
```

## Run Locally

### 1. Start Redis and RabbitMQ

Make sure Docker Desktop is running, then run this from the repository root:

```powershell
docker compose up -d
docker compose ps
```

The Compose configuration exposes Redis on port `6379`, RabbitMQ on `5672`, and the RabbitMQ management UI on `15672`. The management UI credentials are `b2q` / `b2q123`.

### 2. Install dependencies and start the API

In a new PowerShell terminal, from the repository root:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn b2q.webapi.main:app --reload --port 8000
```

If PowerShell blocks virtual-environment activation, allow scripts for this terminal session and activate again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

On startup, the API connects to Redis and RabbitMQ and seeds Redis with up to 500 hourly BTC/USDT candles from Binance. Keep this terminal running.

Check the API at <http://localhost:8000/> or open the interactive API docs at <http://localhost:8000/docs>.

### 3. Install frontend dependencies and start the web app

In another PowerShell terminal:

```powershell
cd b2q\web
npm ci
npm run dev
```

Open the local URL printed by Vite, usually <http://localhost:5173/>. Keep this terminal running too. The frontend connects to the API at `http://localhost:8000`; several dashboard sections currently use mock data.

## Useful Endpoints

- `GET http://localhost:8000/` — API health response
- `GET http://localhost:8000/quantum/analyze?symbol=btcusdt&interval=1h&limit=100` — quantum analysis
- `GET http://localhost:8000/redis/latest?symbol=btcusdt&interval=1h` — latest cached candle
- `GET http://localhost:8000/redis/history?symbol=btcusdt&interval=1h&limit=10` — cached candle history
- `WS ws://localhost:8000/ws/klines?symbol=btcusdt&interval=1h` — live candle stream

The API also provides EMA, Bollinger Bands, RSI, ATR, and Supertrend endpoints. See the interactive docs at `/docs` for details.

## Stop the Services

Stop the API and frontend with `Ctrl+C` in their terminals. Then, from the repository root, stop the Docker services:

```powershell
docker compose down
```

## Troubleshooting

- **Docker Compose cannot find the configuration:** run the command from the repository root, not its parent directory.
- **The API cannot connect to Redis or RabbitMQ:** check that Docker Desktop is running and `docker compose ps` shows both containers as running.
- **The API fails while seeding candles:** check your internet connection and retry; Binance must be reachable at startup.
- **A port is already in use:** stop the process using port `6379`, `5672`, `8000`, or `5173`, or configure that service to use another port.

