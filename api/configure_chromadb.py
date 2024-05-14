from services.vector_store import VectorStore

async def configure_chromadb(host: str="localhost", port: int=8000):
    vector_store = VectorStore()
    vector_store.update_chromadb_connection(host, port)
    return {"message": "ChromaDB connection configured successfully"}