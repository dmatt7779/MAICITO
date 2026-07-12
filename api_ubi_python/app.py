import argparse
import os
import json
import io
import uvicorn
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from fastapi.responses import StreamingResponse
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from api_chat.load_pdf import load_pdf
from api_chat.ask_question import ask_question
from api_chat.create_collection import create_collection
from api_chat.get_collections import get_collections
from api_chat.delete_collection import delete_collection
from services.chromadb_manager import ChromaDBManager

PDF_STORAGE_PATH = os.getenv("PDF_STORAGE_PATH", "/var/www/html/ubi_ceipa/pdf_questions/")
HISTORY_STORAGE_PATH = os.getenv("HISTORY_STORAGE_PATH", "/var/www/html/ubi_ceipa/chat_history/")

app = FastAPI(title="UBI API")

# CORS: allow ceipa.edu.co domains + localhost for dev
app_env = os.getenv("APP_ENV", "production")
origins_regex = r"https?://.*\.ceipa\.edu\.co"
allow_origins = []

if app_env == "development":
    allow_origins = ["http://localhost:3011", "http://localhost:5173", "http://localhost:3009", "http://localhost:3005"]

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=origins_regex,
    allow_origins=allow_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Todas las rutas de negocio viven bajo el prefijo real "/ubi" (la app es dueña
# de su path). Los proxies (Nginx en prod, Vite en dev) solo reenvían la URL tal
# cual, sin reescrituras ni el antiguo truco de doble slash.
router = APIRouter(prefix="/ubi")

class PDFRequest(BaseModel):
    chatbotId: str
    currentQuestion: str

os.makedirs(PDF_STORAGE_PATH, exist_ok=True)
os.makedirs(HISTORY_STORAGE_PATH, exist_ok=True)

def generate_pdf_layout(file_path_or_buffer, chatbot_id, question_history):
    """Función auxiliar para reutilizar la lógica de diseño del PDF"""
    doc = SimpleDocTemplate(file_path_or_buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    question_style = ParagraphStyle(
        'QuestionStyle',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        spaceAfter=10
    )

    story = []
    story.append(Paragraph(f"Historial de Preguntas del Chat: {chatbot_id}", styles['Title']))
    story.append(Spacer(1, 12))

    for i, question in enumerate(question_history):
        text = f"<b>{i + 1}.</b> {question}"
        story.append(Paragraph(text, question_style))

    doc.build(story)

@router.post("/generate_pdf")
async def create_pdf_from_history(request: PDFRequest):
    history_file_path = os.path.join(HISTORY_STORAGE_PATH, f"{request.chatbotId}.json")
    pdf_file_path = os.path.join(PDF_STORAGE_PATH, f"{request.chatbotId}.pdf")
    
    if os.path.exists(history_file_path):
        with open(history_file_path, 'r') as f:
            question_history = json.load(f)
    else:
        question_history = []

    question_history.append(request.currentQuestion)

    with open(history_file_path, 'w') as f:
        json.dump(question_history, f)

    try:
        generate_pdf_layout(pdf_file_path, request.chatbotId, question_history)
        return {"status": "success", "message": f"PDF actualizado con {len(question_history)} preguntas."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar el PDF: {e}")

@router.get("/download_pdf/{chatbot_id}")
async def download_pdf_report(chatbot_id: str):
    history_file_path = os.path.join(HISTORY_STORAGE_PATH, f"{chatbot_id}.json")
    
    if not os.path.exists(history_file_path):
        raise HTTPException(status_code=404, detail="No se encontró historial.")

    with open(history_file_path, 'r') as f:
        question_history = json.load(f)

    try:
        pdf_buffer = io.BytesIO()
        generate_pdf_layout(pdf_buffer, chatbot_id, question_history)
        
        pdf_buffer.seek(0)
        return StreamingResponse(
            pdf_buffer, 
            media_type="application/pdf", 
            headers={'Content-Disposition': f'attachment; filename="{chatbot_id}.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {e}")

router.post("/load_pdf")(load_pdf)
router.post("/ask_question")(ask_question)
router.post("/create_collection")(create_collection)
router.get("/get_collections")(get_collections)
router.delete("/delete_collection")(delete_collection)

@router.post("/check_chromadb")
async def check_chromadb():
    chroma_db_manager = ChromaDBManager()
    return chroma_db_manager.is_chromadb_running()


@app.get("/health")
async def health():
    """Liveness check para Docker. Es liviano y NO depende de servicios
    externos (ChromaDB/OpenAI); solo confirma que la app está viva."""
    return {"status": "ok"}


# Registrar todas las rutas del router (/ubi/*) en la app
app.include_router(router)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='ChromaDB API with FastAPI')
    parser.add_argument('-uh', '--uvicorn-host', type=str, default='0.0.0.0', help='Host for the Uvicorn server')
    parser.add_argument('-up', '--uvicorn-port', type=int, default=8001, help='Port for the Uvicorn server')
    parser.add_argument('-wk', '--workers', type=int, default=int(os.getenv('UVICORN_WORKERS', '1')), help='Number of Uvicorn workers (env: UVICORN_WORKERS)')
    args = parser.parse_args()
    uvicorn.run(app, host=args.uvicorn_host, port=args.uvicorn_port, log_level="debug", workers=args.workers)