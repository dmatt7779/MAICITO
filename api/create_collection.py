from fastapi import Body
from services.chromadb_manager import ChromaDBManager
from services.vector_store import VectorStore

chroma_db_manager = ChromaDBManager()
vector_store = VectorStore()

async def create_collection(collection_name: str = Body(...)):
    try:
        client = chroma_db_manager.get_client()
        client.create_collection(name=collection_name, embedding_function=vector_store.openai_ef)
        return {"message": f"Collection '{collection_name}' created successfully"}
    except Exception as e:
        return {"error": str(e)}