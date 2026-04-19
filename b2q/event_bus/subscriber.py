import redis
import json

# Redis bağlantısı
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def listen_for_events(callback_function):
    """
    Kanalı sürekli dinler ve bir olay geldiğinde bunu 
    parametre olarak verilen callback_function'a (işleyiciye) iletir.
    """
    pubsub = r.pubsub()
    pubsub.subscribe('b2q_events')
    print("[EVENT BUS] 'b2q_events' channel is being monitored. Real events are expected...")

    for message in pubsub.listen():
        if message['type'] == 'message':
            try:
                event_data = json.loads(message['data'])
                
                callback_function(event_data)
                
            except Exception as e:
                print(f"[ERROR] Error processing message: {e}")

# --- INTEGRATION TEST (Quantum Engine or Agents will use this) ---
if __name__ == "__main__":
    
    # Kuantum veya Ajan kodlarını yazacak kişinin hazırlayacağı fonksiyon
    def event_handler(event_data):
        event_type = event_data.get('event_type')
        data = event_data.get('data', {})
        
        if event_type == 'DATA_READY':
            symbol = data.get('symbol')
            print(f"\n[System] REAL data for ‘{symbol}’ has been downloaded to storage!")
            print(f"[System] Quantum analysis and AI agents are being triggered...")
            
        elif event_type == 'TRADE_EXECUTED':
            print(f"\n[System] Trade executed on Binance!")

    # Sistemi başlat ve olayları isleyici fonksiyona yönlendir
    listen_for_events(event_handler)