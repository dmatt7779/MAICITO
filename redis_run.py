import redis

# Redis configuration (replace with your details)
redis_host = '127.0.0.1'  # Or your Redis hostname 
redis_port = 6379
redis_db = 0  # Default database

class RedisRun:
    redis_client = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db)