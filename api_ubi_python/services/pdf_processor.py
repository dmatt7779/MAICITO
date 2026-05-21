import fitz 
import re
from langchain.text_splitter import RecursiveCharacterTextSplitter

class PDFProcessor:
    def __init__(self):
        # El "Recursive" es el estándar de oro para libros y textos largos
        # Intenta separar primero por párrafos, luego por oraciones
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=700,      # Tamaño ideal para no perder contexto
            chunk_overlap=100,    # 15% de solapamiento para nombres cortados
            separators=["\n\n", "\n", ".", " ", ""]
        )

    def _extract_text(self, pdf_content: bytes) -> str:
        text = ""
        # fitz abre el contenido en memoria de forma mucho más precisa
        with fitz.open(stream=pdf_content, filetype="pdf") as doc:
            for page in doc:
                # "text" mantiene el orden lógico de lectura
                text += page.get_text("text") + "\n"
        return text

    def _clean_text(self, text: str) -> str:
        # 1. Normalizamos espacios extraños (\xa0) que vimos en tus PDFs
        text = text.replace('\xa0', ' ')
        # 2. Corregimos el error de "R odrigo" (espacios entre letras mayúsculas y minúsculas)
        # Esto es un truco avanzado para limpiar PDFs mal codificados
        text = re.sub(r'([A-Z])\s([a-z])', r'\1\2', text)
        # 3. Limpieza general de espacios en blanco
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def process(self, pdf_content: bytes, document_name: str, course_name: str) -> list[dict]:
        raw_text = self._extract_text(pdf_content)
        cleaned_text = self._clean_text(raw_text)
        
        # Generamos los chunks usando la lógica recursiva
        # Esto se adapta automáticamente si el PDF es un libro o una tabla
        docs = self.text_splitter.create_documents([cleaned_text])
        
        text_chunks = []
        for i, doc in enumerate(docs):
            text_chunks.append({
                "text": doc.page_content,
                "metadata": {
                    "document_name": document_name,
                    "course_name": course_name,
                    "chunk_id": i
                },
                "id": f"{document_name}_{i}"
            })
        return text_chunks