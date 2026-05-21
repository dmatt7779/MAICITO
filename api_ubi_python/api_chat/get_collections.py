from services.chromadb_manager import ChromaDBManager

chroma_db_manager = ChromaDBManager()

async def get_collections():
    try:
        client = chroma_db_manager.get_client()
        return {"collections": client.list_collections()}
    except Exception as e:
        return {"error": str(e)}