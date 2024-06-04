import argparse
from fastapi import FastAPI

from api_chat.load_pdf import load_pdf
from api_chat.ask_question import ask_question
from api_chat.create_collection import create_collection
from api_chat.get_collections import get_collections
from api_chat.delete_collection import delete_collection

from services.chromadb_manager import ChromaDBManager

app = FastAPI(title="MACITO API with FastAPI")

# Define routes
app.post("/load_pdf")(load_pdf)
app.post("/ask_question")(ask_question)
app.post("/create_collection")(create_collection)
app.get("/get_collections")(get_collections)
app.delete("/delete_collection")(delete_collection)

@app.post("/check_chromadb")
async def check_chromadb():
    chroma_db_manager = ChromaDBManager()
    return chroma_db_manager.is_chromadb_running()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='ChromaDB API with FastAPI')
    parser.add_argument('-uh', '--uvicorn-host', type=str, default='0.0.0.0', help='Host for the Uvicorn server')
    parser.add_argument('-up', '--uvicorn-port', type=int, default=8001, help='Port for the Uvicorn server')
    args = parser.parse_args()

    # Start the FastAPI application
    import uvicorn
    uvicorn.run(app, host=args.uvicorn_host, port=args.uvicorn_port)