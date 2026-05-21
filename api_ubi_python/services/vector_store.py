import os
from typing import List, Dict # O usa list, dict si prefieres el estilo Python 3.12
from chromadb.utils import embedding_functions
from services.chromadb_manager import ChromaDBManager

chroma_db_manager = ChromaDBManager()

class VectorStore:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.openai_ef = embedding_functions.OpenAIEmbeddingFunction(
            api_key=self.api_key,
            model_name="text-embedding-3-small"
        )

    def add_documents(self, text_chunks_with_metadata: List[Dict], collection_name: str):
        self.client = chroma_db_manager.get_client()
        collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.openai_ef
        )

        documents = []
        metadatas = []
        ids = []

        for chunk in text_chunks_with_metadata:
            documents.append(chunk["text"])
            metadatas.append(chunk["metadata"])
            ids.append(chunk.get("id"))

        try:
            collection.add(documents=documents, metadatas=metadatas, ids=ids)
            print(f"✅ Se agregaron {len(documents)} fragmentos a la colección {collection_name}")
        except Exception as e:
            print(f"❌ Error masivo al agregar documentos: {e}")

    def get_relevant_documents(self, query: str, collection_name: str, top_k: int = 8) -> List[Dict]:
        self.client = chroma_db_manager.get_client()
        collection = self.client.get_collection(
            name=collection_name, 
            embedding_function=self.openai_ef
        )
        
        results = collection.query(
            query_texts=[query], 
            n_results=top_k
        )
        
        documents = []
        if results["documents"] and len(results["documents"][0]) > 0:
            for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
                documents.append({
                    "text": doc,
                    "metadata": {
                        "document_name": meta.get("document_name", "Desconocido"),
                        "course_name": meta.get("course_name", "General")
                    }
                })
        return documents