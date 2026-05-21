import argparse
import os
import json
import io
import uvicorn
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from fastapi.responses import StreamingResponse
from fastapi import FastAPI, HTTPException
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

PDF_STORAGE_PATH = "/var/www/html/ubi_ceipa/pdf_questions/"
HISTORY_STORAGE_PATH = "/var/www/html/ubi_ceipa/chat_history/"

app = FastAPI(title="UBI API")
origins_regex = "https?://.*\.ceipa\.edu\.co"

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=origins_regex,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("//generate_pdf")
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

@app.get("//download_pdf/{chatbot_id}")
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

app.post("//load_pdf")(load_pdf)
app.post("//ask_question")(ask_question)
app.post("//create_collection")(create_collection)
app.get("//get_collections")(get_collections)
app.delete("//delete_collection")(delete_collection)

@app.post("/check_chromadb")
async def check_chromadb():
    chroma_db_manager = ChromaDBManager()
    return chroma_db_manager.is_chromadb_running()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='ChromaDB API with FastAPI')
    parser.add_argument('-uh', '--uvicorn-host', type=str, default='0.0.0.0', help='Host for the Uvicorn server')
    parser.add_argument('-up', '--uvicorn-port', type=int, default=8001, help='Port for the Uvicorn server')
    parser.add_argument('-wk', '--workers', type=int, default=16, help='Number or available threads')
    args = parser.parse_args()
    uvicorn.run(app, host=args.uvicorn_host, port=args.uvicorn_port, log_level="debug", workers=args.workers)