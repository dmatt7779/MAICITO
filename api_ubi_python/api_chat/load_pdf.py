from fastapi import Body
from typing import List
from fastapi import HTTPException

# Replace with your chosen PDF processing and vector store libraries
from services.vector_store import VectorStore
from services.pdf_processor import PDFProcessor

pdf_processor = PDFProcessor()
vector_store = VectorStore()

# pdf_paths: str, course_name: str, collection_name: str
async def load_pdf(data: str = Body(...)):
    params_splitted = data.split('|')

    course_name = params_splitted[0]
    collection_name = params_splitted[0]
    pdf_paths = params_splitted[1].split(",")

    for pdf_path in pdf_paths:
        try:
            with open(pdf_path, "rb") as f:
                document_name = pdf_path.split("/")[-1]
                pdf_bytes = f.read()
                text_chunks_with_metadata = pdf_processor.process(pdf_bytes, document_name, course_name)

            vector_store.add_documents(text_chunks_with_metadata, collection_name)
        except FileNotFoundError:
            raise HTTPException(status_code=400, detail=f"PDF not found at path: {pdf_path}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing PDF: {e}")

    return {"message": "PDFs uploaded and processed successfully"}