from fastapi import Body, Depends
from services.vector_store import VectorStore

async def create_collection(collection_name: str = Body(...), vector_store: VectorStore = Depends()):
    try:
        vector_store.client.create_collection(name=collection_name, embedding_function=vector_store.openai_ef)
        return {"message": f"Collection '{collection_name}' created successfully"}
    except Exception as e:
        return {"error": str(e)}