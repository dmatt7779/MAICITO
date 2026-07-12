# =============================================
# UBI Python Backend - Multi-stage Dockerfile
# =============================================

# ── Base stage: shared dependencies ──
FROM python:3.11-slim AS base

WORKDIR /app

# Install system dependencies for some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# ── Development target ──
FROM base AS dev
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ── Production target ──
# El nº de workers se decide en runtime (entrypoint): UVICORN_WORKERS o,
# si no está, se deriva de las CPU del host. Ya no está hardcodeado.
FROM base AS prod

# Endurecimiento: correr como usuario NO-root. Usamos www-data (uid 33), el
# mismo uid que el contenedor PHP, para compartir el volumen ubi-uploads con
# permisos consistentes (PHP escribe / Python lee y escribe).
RUN mkdir -p /var/www/shared/files /var/www/shared/images \
    /var/www/shared/pdf_questions /var/www/shared/chat_history \
    && chown -R www-data:www-data /var/www/shared /app
USER www-data

CMD ["sh", "entrypoint.sh"]
