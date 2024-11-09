import argparse
import ssl
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from api_chat.load_pdf import load_pdf
from api_chat.ask_question import ask_question
from api_chat.create_collection import create_collection
from api_chat.get_collections import get_collections
from api_chat.delete_collection import delete_collection

from services.chromadb_manager import ChromaDBManager
from fastapi.responses import Response

app = FastAPI(title="UBI API")

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain('C:/xampp/apache/conf/ssl.ceipa/certificate.crt', keyfile='C:/xampp/apache/conf/ssl.ceipa/private.key')

origins_regex = "https?://.*\.ceipa\.edu\.co"

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=origins_regex,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    parser.add_argument('-wk', '--workers', type=int, default=16, help='Number or available threads')
    args = parser.parse_args()

    # Start the FastAPI application
    import uvicorn
    # uvicorn.run(app, host=args.uvicorn_host, port=args.uvicorn_port, ssl=ssl_context, log_level="debug")
    uvicorn.run(app, host=args.uvicorn_host, port=args.uvicorn_port, ssl=ssl_context, log_level="debug", workers=args.workers)
