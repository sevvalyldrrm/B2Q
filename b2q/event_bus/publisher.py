import redis
import json
import time

# Redis bağlantısı
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def publish_event(event_type, payload):
    """
    Sisteme genel bir anons (event) fırlatır. İleride Ajanlar da bunu kullanacak.
    """
    event_data = {
        "event_type": event_type,
        "timestamp": time.time(),
        "data": payload
    }
    
    message = json.dumps(event_data)
    r.publish('b2q_events', message)
    print(f"[EVENT BUS] Published: {event_type} -> {payload}")

def publish_data_ready_event(symbol):
    """
    Örnek kullanım: publish_data_ready_event("BTCUSDT")
    """
    publish_event("DATA_READY", {"symbol": symbol})