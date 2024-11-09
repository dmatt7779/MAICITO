import redis

try:
    r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True) # decode_responses for getting strings
    pong = r.ping()
    if pong:
        print("PONG")  # Or print(pong)  # Redis returns True if successful
    else:
        print("Redis connection failed")

except redis.exceptions.ConnectionError as e:
    print(f"Could not connect to Redis: {e}")