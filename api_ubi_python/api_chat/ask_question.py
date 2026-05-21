import asyncio
import re
# Eliminamos las importaciones de markdown y BeautifulSoup que ya no necesitamos
from fastapi import Body
from fastapi import HTTPException
from services.question_answering import QuestionAnswering
from services.vector_store import VectorStore
import datetime
import concurrent.futures

question_answering = QuestionAnswering()
vector_store = VectorStore()
MAX_THREADS = 16 

def process_question_worker(data: str):
    inicio = datetime.datetime.now()
    print(f"Worker iniciado: {inicio.isoformat()}")

    try:
        params_splitted = data.split('|')
        collection_name = params_splitted[0]
        question = params_splitted[1]

        retrieved_chunks = vector_store.get_relevant_documents(question, collection_name)
        
        # Obtenemos la respuesta limpia y en Markdown del modelo
        answer = question_answering.generate_answer(question, retrieved_chunks)
        
        # YA NO USAMOS formatting_response_to_html. 
        # Pasamos la respuesta directamente para que el FrontEnd se encargue del renderizado
        raw_markdown_answer = answer

        fin = datetime.datetime.now()
        print(f"Worker finalizado: {fin.isoformat()}")

        return {"answer": raw_markdown_answer}

    except Exception as e:
        return {"error": str(e)}
    
async def ask_question(data: str = Body(...)):
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
        response = await asyncio.to_thread(process_question_worker, data)
    if "error" in response:
        raise HTTPException(status_code=500, detail=response["error"])
    
    return response