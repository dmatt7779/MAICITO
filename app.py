import argparse
from fastapi import FastAPI

from api.load_pdf import load_pdf
from api.ask_question import ask_question
from api.create_collection import create_collection
from api.get_collections import get_collections
from api.delete_collection import delete_collection

app = FastAPI(title="RAG System API")

# Define routes
app.post("/load_pdf")(load_pdf)
app.post("/ask_question")(ask_question)
app.post("/create_collection")(create_collection)
app.get("/get_collections")(get_collections)
app.delete("/delete_collection")(delete_collection)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='ChromaDB API with FastAPI')
    parser.add_argument('-uh', '--uvicorn-host', type=str, default='0.0.0.0', help='Host for the Uvicorn server')
    parser.add_argument('-up', '--uvicorn-port', type=int, default=8001, help='Port for the Uvicorn server')
    parser.add_argument('-ch', '--chroma-host', type=str, default='localhost', help='Hostname for client-server mode.')
    parser.add_argument('-cp', '--chroma-port', type=int, default=8000, help='Port for client-server mode.')
    args = parser.parse_args()

    # test_chromadb_connection(host=args.chroma_host, port=args.chroma_port)

    # Start the FastAPI application
    import uvicorn
    uvicorn.run(app, host=args.uvicorn_host, port=args.uvicorn_port)