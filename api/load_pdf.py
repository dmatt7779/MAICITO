from typing import List
from fastapi import HTTPException, Depends

# Replace with your chosen PDF processing and vector store libraries
from services.vector_store import VectorStore
from services.pdf_processor import PDFProcessor

pdf_processor = PDFProcessor()
vector_store = VectorStore()

async def load_pdf(pdf_paths: List[str], course_name: str, vector_store: VectorStore = Depends()):
    for pdf_path in pdf_paths:
        try:
            # Process PDF and extract text
            with open(pdf_path, "rb") as f:
              document_name = pdf_path.split("/")[-1]  # Extract document name from path
              text_chunks_with_metadata = pdf_processor.process(f, document_name, course_name)

            # Embed and store chunks in Chroma
            vector_store.add_documents(text_chunks_with_metadata)
        except FileNotFoundError:
            raise HTTPException(status_code=400, detail=f"PDF not found at path: {pdf_path}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing PDF: {e}")

    return {"message": "PDFs uploaded and processed successfully"}