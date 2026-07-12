#!/bin/sh
set -e

# =============================================
# UBI Python Backend - Entrypoint (producción)
# =============================================
# Número de workers de Uvicorn:
#   - Si UVICORN_WORKERS está definido en el entorno, se respeta.
#   - Si no, se deriva de las CPU disponibles: (2 * nproc) + 1.
#     Ajusta UVICORN_WORKERS si tu host tiene poca RAM (cada worker
#     carga las librerías en memoria).
if [ -z "${UVICORN_WORKERS}" ]; then
  CPUS="$(nproc 2>/dev/null || echo 1)"
  UVICORN_WORKERS="$(( CPUS * 2 + 1 ))"
fi

echo "[entrypoint] Iniciando Uvicorn con ${UVICORN_WORKERS} workers (log: ${UVICORN_LOG_LEVEL:-info})"

exec uvicorn app:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers "${UVICORN_WORKERS}" \
  --log-level "${UVICORN_LOG_LEVEL:-info}"
