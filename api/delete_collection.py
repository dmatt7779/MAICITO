from fastapi import Body, Depends
from services.vector_store import VectorStore

async def delete_collection(collection_name: str = Body(...), vector_store: VectorStore = Depends()):
    try:
        vector_store.client.delete_collection(name=collection_name)
        return {"message": f"Collection '{collection_name}' deleted successfully"}
    except Exception as e:
        return {"error": str(e)} 