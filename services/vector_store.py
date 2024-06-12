import os
from typing import List, Dict
from chromadb.utils import embedding_functions
from services.chromadb_manager import ChromaDBManager

chroma_db_manager = ChromaDBManager()

class VectorStore:
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
        )
        self.openai_ef = embedding_functions.OpenAIEmbeddingFunction(
            api_key=self.api_key,
            model_name="text-embedding-3-small"
        )

    def add_documents(self, text_chunks_with_metadata: List[Dict], collection_name: str):
        self.client = chroma_db_manager.get_client()
        collection = self.client.get_collection(name=collection_name)
        for chunk in text_chunks_with_metadata:
            document = [chunk["text"]]
            metadata = [chunk["metadata"]]
            id = [chunk.get("id")]

            try:
                collection.add(documents=document, metadatas=metadata, ids=id)
            except Exception as e:
                print(f"An error occurred while adding documents to the collection: {e}, for chunk: {chunk}")

    # Metadata extraction in get_relevant_documents method: The code assumes that every metadata object has "document_name" and "course_name" keys. If a metadata object doesn't have these keys, the code will raise a KeyError. Consider adding error handling for this case.
    def get_relevant_documents(self, query: str, collection_name: str, top_k: int = 3) -> List[Dict[str, str]]:
        self.client = chroma_db_manager.get_client()
        collection = self.client.get_collection(name=collection_name)
        results = collection.query(
            query_texts=[query], n_results=top_k
        )
        try:
            documents = [
                {
                    "text": document, 
                    "metadata": {
                        "document_name": metadata["document_name"],
                        "course_name": metadata["course_name"]
                    }
                }
                for document, metadata in zip(results["documents"][0], results["metadatas"][0])
            ]
        except KeyError as e:
            raise KeyError(f"Metadata extraction error: {e}")
        except Exception as e:
            raise Exception(f"Error retrieving documents: {e}")
        return documents