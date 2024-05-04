from fastapi import Depends
from services.vector_store import VectorStore

async def get_collections(vector_store: VectorStore = Depends()):
    try:
        collections = vector_store.client.list_collections()
        return {"collections": collections}
    except Exception as e:
        return {"error": str(e)} 