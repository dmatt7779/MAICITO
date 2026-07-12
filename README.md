# UBI — Asistente Virtual con IA (CEIPA Business School)

UBI es un asistente virtual académico (RAG) para CEIPA. Un administrador crea "salas"
(rooms) y sube PDFs de cada curso; el bot responde preguntas de los estudiantes usando
esos documentos como contexto, apoyándose en OpenAI y una base de datos vectorial
(ChromaDB).

El proyecto está contenerizado con Docker en un ecosistema de microservicios, con
configuraciones separadas para **desarrollo (DEV)** y **producción (PROD)**.

> Para el detalle profundo de arquitectura y flujos, ver [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md).

---

## 🏛️ Arquitectura

| Servicio | Imagen / Stack | Rol | Puerto DEV | Puerto PROD |
| :--- | :--- | :--- | :--- | :--- |
| `ubi-frontend` | React + Vite (dev) / **Nginx** (prod) | Panel admin + **reverse proxy** en prod | `3011` | `80` (único expuesto) |
| `ubi-php` | PHP 8.2 + Apache | REST de negocio: login JWT, CRUD de salas, subida de archivos | `3009` | interno |
| `ubi-python` | FastAPI + Python 3.11 | IA/RAG: vectorización, embeddings, respuestas OpenAI | `3010` | interno |
| `ubi-chromadb` | ChromaDB 0.5.0 | Base de datos vectorial (RAG) | `3008` | interno |
| `ubi-mysql` | MySQL 8.0 | Base de datos relacional | *(usa MySQL del host)* | interno |

**Ruteo:** el frontend enruta `/api/*` → PHP y `/ubi/*` → Python (vía proxy de Vite en
dev y Nginx en prod). Todo es *same-origin* de cara al navegador.

**Volúmenes compartidos:**
- `ubi-uploads` → `/var/www/shared` (PHP escribe los PDFs/imágenes, Python los lee para vectorizar).
- `ubi-chroma-data` → persistencia de vectores.
- `ubi-mysql-data` → datos de MySQL (solo PROD).

---

## ✅ Requisitos previos

- Docker y Docker Compose v2.
- Una API key de **OpenAI**.
- **Solo DEV:** una instancia de MySQL corriendo en el **host** en el puerto `3307`
  con la base `ceipa_chatbot` (en DEV no se levanta un contenedor MySQL; PHP se conecta
  al host vía `host.docker.internal`).

---

## 📁 Estructura del proyecto

```
.
├── admin/                # Frontend React (Vite + TS) — panel admin
├── api_php/              # Backend PHP (Apache) — auth, salas, archivos
│   └── keys/             # Llaves JWT (.pem) — NO versionadas, montadas en runtime
├── api_ubi_python/       # Backend FastAPI — RAG / OpenAI / ChromaDB
├── db/                   # Imagen MySQL + dump de inicialización (solo PROD)
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── .env.example          # Plantilla de variables (copiar a .env.dev / .env.prod)
└── DEPLOYMENT_GUIDE.md   # Guía detallada de arquitectura y despliegue
```

---

## 🔑 Variables de entorno

Copia la plantilla y ajústala por entorno:

```bash
cp .env.example .env.dev     # para desarrollo
cp .env.example .env.prod    # para producción
```

Los `.env.*` están **gitignored** (nunca se suben al repo). Estas son las variables clave:

| Variable | Descripción | DEV | PROD |
| :--- | :--- | :--- | :--- |
| `OPENAI_API_KEY` | **⚠️ Obligatoria.** Llave de OpenAI | tu llave | tu llave de prod |
| `OPENAI_MODEL` | Modelo de chat del catedrático IA | `gpt-5.1` | `gpt-5.1` |
| `OPENAI_EMBEDDING_MODEL` | Modelo de embeddings (cambiarlo obliga a re-vectorizar) | `text-embedding-3-small` | igual |
| `DB_HOST` | Host de MySQL | `host.docker.internal` | `ubi-mysql` |
| `DB_PORT` | Puerto de MySQL | `3307` | `3306` |
| `DB_PASSWORD` | **⚠️ Obligatoria.** Password de MySQL | el de tu MySQL local | **password fuerte** |
| `MYSQL_ROOT_PASSWORD` | Password root del contenedor MySQL (solo PROD) | — | **password fuerte** |
| `MAIL_PASSWORD` | **⚠️ Obligatoria.** Password SMTP (recuperación de cuenta) | — | password real |
| `APP_ENV` | Modo de ejecución (afecta CORS/logs) | `development` | `production` |
| `APP_PUBLIC_URL` | URL pública (enlaces absolutos en emails) | `http://localhost:3011` | `https://ubi.ceipa.edu.co` |
| `CHROMA_HOST` / `CHROMA_PORT` | Vector store | `ubi-chromadb` / `8000` | igual |
| `JWT_PRIVATE_KEY_FILE` / `JWT_PUBLIC_KEY_FILE` | Ruta de las llaves JWT dentro del contenedor | `/var/www/keys/...` | igual |
| `UVICORN_WORKERS` | Nº de workers del backend Python (vacío = deriva de CPU) | — | opcional |

### 🚨 Qué cambiar SÍ o SÍ antes de producción
1. `OPENAI_API_KEY` con la llave real.
2. `MYSQL_ROOT_PASSWORD`, `DB_PASSWORD` y `MAIL_PASSWORD` con **valores fuertes y nuevos**
   (el password legacy `Ceipa.2024**` está comprometido y debe rotarse en los servicios reales).
3. Generar un **par de llaves JWT nuevo** para prod (ver abajo).

---

## 🔐 Llaves JWT (obligatorio)

Las llaves RSA **no** viven en el código; se leen de archivos `.pem` montados fuera del
document root (`/var/www/keys`, solo lectura). Están gitignored y excluidas de la imagen.

Genera un par (uno para DEV y **otro distinto** para PROD):

```bash
openssl genrsa -out api_php/keys/jwt_private.pem 2048
openssl rsa -in api_php/keys/jwt_private.pem -pubout -out api_php/keys/jwt_public.pem
```

> En DEV ya vienen unas llaves generadas. Para PROD, genera un par propio en el servidor.

---

## 🛠️ Desarrollo (DEV)

Hot-reload en React, PHP y Python; todos los puertos expuestos para depurar.

```bash
# 1. Asegúrate de tener MySQL del host en :3307 y el .env.dev configurado
cp .env.example .env.dev      # y edita OPENAI_API_KEY, DB_PASSWORD, etc.

# 2. Levantar (build + arranque en segundo plano)
docker compose -f docker-compose.dev.yml up --build -d

# 3. Estado y logs
docker compose -f docker-compose.dev.yml ps           # todos deben quedar "healthy"
docker compose -f docker-compose.dev.yml logs -f ubi-python
```

**Puntos de acceso DEV:**
- 🖥️ Panel Admin: <http://localhost:3011>
- 🐘 API PHP: <http://localhost:3009>
- 🐍 API Python (Swagger): <http://localhost:3010/docs>
- 🔮 ChromaDB (heartbeat): <http://localhost:3008/api/v1/heartbeat>

---

## 🏢 Producción (PROD)

Imágenes inmutables y optimizadas; infraestructura autocontenida (incluye su MySQL).
**Solo el puerto 80** queda expuesto (Nginx); el resto queda aislado en la red interna.

```bash
# 1. Generar llaves JWT de producción (ver sección de llaves)
# 2. Configurar .env.prod con passwords fuertes y OPENAI_API_KEY real
cp .env.example .env.prod

# 3. Levantar
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml ps
```

En el **primer arranque**, `ubi-mysql` ejecuta automáticamente el dump
[`db/sql-ubi-12_24.sql`](./db/sql-ubi-12_24.sql) (tablas, usuarios y stored procedures).

**Acceso PROD:** <http://tu-servidor/> — el frontend se sirve en `/`, y Nginx redirige
`/api/*` → PHP y `/ubi/*` → Python internamente.

---

## 🧪 Verificación (smoke test)

```bash
# Salud de cada servicio (DEV)
curl localhost:3008/api/v1/heartbeat     # ChromaDB
curl localhost:3010/health               # Python -> {"status":"ok"}
curl localhost:3009/health.php           # PHP    -> {"status":"ok"}

# Estado/health de todos los contenedores
docker compose -f docker-compose.dev.yml ps
```

**Flujo end-to-end:**
1. Entra al admin (`:3011`) y haz login (valida JWT).
2. Crea una sala y sube un PDF. Confirma que el archivo llegó al volumen compartido:
   ```bash
   docker compose -f docker-compose.dev.yml exec ubi-php ls -la /var/www/shared/files
   ```
3. Revisa los logs de `ubi-python`: la vectorización debe correr sin `FileNotFoundError`.
4. Prueba el chatbot (widget → `/ubi/ask_question`) y que la imagen de la sala cargue.

---

## 📟 Comandos útiles

```bash
# Ver logs de un servicio
docker compose -f docker-compose.dev.yml logs -f ubi-php

# Reconstruir tras instalar dependencias (npm/pip/composer)
docker compose -f docker-compose.dev.yml up --build -d

# Reiniciar solo la capa de IA
docker compose -f docker-compose.dev.yml restart ubi-python ubi-chromadb

# Detener
docker compose -f docker-compose.dev.yml down

# Detener y BORRAR volúmenes (resetea BD y vectores a cero)
docker compose -f docker-compose.dev.yml down -v

# Entrar a un contenedor
docker compose -f docker-compose.dev.yml exec ubi-python sh
```

---

## 🔒 Seguridad (resumen de buenas prácticas ya aplicadas)

- **Sin secretos en el código:** llaves JWT en archivos montados; passwords de DB/correo
  obligatorios por env (sin fallback hardcodeado).
- **Contenedores no-root en prod:** Python corre como `www-data`; frontend en imagen
  `nginx-unprivileged`.
- **CORS restringido** a `*.ceipa.edu.co` (consistente en PHP y Python).
- **`.gitignore` / `.dockerignore`:** los `.env.*`, las llaves `.pem`, `node_modules`,
  `vendor`, entornos virtuales y los archivos subidos por usuarios no entran ni al repo
  ni a las imágenes.

---

## 🧰 Solución de problemas

| Síntoma | Causa probable / solución |
| :--- | :--- |
| `ubi-python` tarda en quedar *healthy* | Normal: `start_period 40s` por los imports pesados (torch/langchain). |
| PHP no conecta a MySQL en DEV (`Connection refused`) | Verifica MySQL del host en `:3307` y `DB_HOST=host.docker.internal` / `DB_PORT=3307` en `.env.dev`. |
| `ModuleNotFoundError: fitz` | Reconstruye la imagen: la dependencia es `PyMuPDF` (ya en `requirements.txt`). |
| El bot no encuentra el PDF (`FileNotFoundError`) | Revisa que PHP y Python compartan el volumen `ubi-uploads` en `/var/www/shared`. |
| Login falla / token inválido | Faltan o no coinciden las llaves en `api_php/keys/`. Regenera el par. |
| Empezar de cero | `docker compose -f <archivo> down -v` (borra volúmenes). |
