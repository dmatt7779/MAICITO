import os
from typing import List, Dict
import chromadb
from chromadb.utils import embedding_functions
os.environ["OPENAI_API_KEY"] = ""

class VectorStore:
    _heartbeat_completed = False  # Class-level variable to track heartbeat status
    
    def __init__(self, collection_name: str="heartbeat"):
        # Initialize Chroma client
        self.client = chromadb.Client()
        
        self.sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
        )
        self.openai_ef = embedding_functions.OpenAIEmbeddingFunction(
            api_key=os.environ["OPENAI_API_KEY"],
            model_name="text-embedding-3-small"
        )

        # Use get_or_create_collection
        self.collection = self.client.get_or_create_collection(name=collection_name)

        # Perform heartbeat check only once
        if not VectorStore._heartbeat_completed:
            try:
                self.client.get_or_create_collection(name="heartbeat")
                self.client.delete_collection(name="heartbeat")
                VectorStore._heartbeat_completed = True  # Mark heartbeat as completed
            except Exception as e:
                raise Exception(f"ChromaDB connection error: {e}")
            print("ChromaDB connection test successful!")

    def add_documents(self, text_chunks_with_metadata: List[Dict]):
        for chunk in text_chunks_with_metadata:
            document = chunk["text"]
            metadata = chunk["metadata"]
            id = chunk.get("id")

            try:
                self.collection.add(documents=[document], metadatas=[metadata], ids=[id])
            except Exception as e:
                print(f"An error occurred while adding documents to the collection: {e}")
    def get_relevant_documents(self, query: str, top_k: int = 3) -> List[Dict[str, str]]:
        results = self.collection.query(
            query_texts=[query], n_results=top_k
        )
        return [
            {
                "text": document, 
                "metadata": {
                    "document_name": metadata["document_name"],
                    "course_name": metadata["course_name"]
                }
            }
            for document, metadata in zip(results["documents"][0], results["metadatas"][0])
        ]