import argparse
import chromadb
from fastapi import FastAPI, Body

app = FastAPI()

# Assuming you are using client-server mode
chroma_client = chromadb.HttpClient(host="localhost", port=8000)

@app.post("/create_collection")
async def create_collection(collection_name: str = Body(...)):
    """
    Creates a new collection in ChromaDB.

    Args:
        collection_name: The name of the collection to create.
    """
    try:
        chroma_client.get_or_create_collection(name=collection_name)
        return {"message": f"Collection '{collection_name}' created successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/get_collections")
async def get_collections():
    """
    Retrieves a list of available collections in ChromaDB.
    """
    try:
        collections = chroma_client.list_collections()
        return {"collections": collections}
    except Exception as e:
        return {"error": str(e)}

@app.delete("/delete_collection")
async def delete_collection(collection_name: str = Body(...)):
    """
    Deletes a collection from ChromaDB.

    Args:
        collection_name: The name of the collection to delete.
    """
    try:
        chroma_client.delete_collection(name=collection_name)
        return {"message": f"Collection '{collection_name}' deleted successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/add_documents")
async def add_documents(
    collection_name: str,
    documents: list[str] = Body(...),
    metadatas: list[dict] = Body(None),
    ids: list[str] = Body(None),
):
    """
    Adds documents to a specified collection in ChromaDB.

    Args:
        collection_name: Name of the ChromaDB collection.
        documents: List of documents to add.
        metadatas: Optional list of metadata dictionaries for each document.
        ids: Optional list of IDs for each document.
    """
    try:
        collection = chroma_client.get_collection(collection_name)
        collection.add(documents=documents, metadatas=metadatas, ids=ids)
        return {"message": "Documents added successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/query")
async def query_documents(
    collection_name: str,
    query_texts: list[str] = Body(...),
    n_results: int = 3
):
    """
    Queries documents in a specified collection using ChromaDB.

    Args:
        collection_name: Name of the ChromaDB collection.
        query_texts: List of query texts.
        n_results: Number of results to return.
    """
    try:
        collection = chroma_client.get_collection(collection_name)
        results = collection.query(query_texts=query_texts, n_results=n_results)
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}

def test_chromadb_connection(host="localhost", port=8000):
    """
    Tests the connection to ChromaDB by creating, listing, and deleting a collection.
    Uses client-server mode.

    Args:
        host: str, hostname for client-server mode.
        port: int, port for client-server mode.
    """

    chroma_client = chromadb.HttpClient(host=host, port=port)

    # Create a collection
    collection_name = "test_collection3"
    chroma_client.get_or_create_collection(name=collection_name)

    # Verify the created collection exists
    try:
        collection = chroma_client.get_collection(collection_name)
    except Exception as e:
        print(f"Failed to get collection '{collection_name}': {str(e)}")
    assert collection.name == collection_name

    # Delete the collection
    chroma_client.delete_collection(name=collection_name)

    print("ChromaDB connection test successful!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='ChromaDB API with FastAPI')
    parser.add_argument('-uh', '--uvicorn-host', type=str, default='0.0.0.0', help='Host for the Uvicorn server')
    parser.add_argument('-up', '--uvicorn-port', type=int, default=8001, help='Port for the Uvicorn server')
    parser.add_argument('-ch', '--chroma-host', type=str, default='localhost', help='Hostname for client-server mode.')
    parser.add_argument('-cp', '--chroma-port', type=int, default=8000, help='Port for client-server mode.')
    args = parser.parse_args()

    test_chromadb_connection(host=args.chroma_host, port=args.chroma_port)

    # Start the FastAPI application
    import uvicorn
    uvicorn.run(app, host=args.uvicorn_host, port=args.uvicorn_port)