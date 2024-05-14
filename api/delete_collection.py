from fastapi import Body
from services.chromadb_manager import ChromaDBManager

chroma_db_manager = ChromaDBManager()

async def delete_collection(collection_name: str = Body(...)):
    try:
        client = chroma_db_manager.get_client()
        client.delete_collection(name=collection_name)
        return {"message": f"Collection '{collection_name}' deleted successfully"}
    except Exception as e:
        return {"error": str(e)}