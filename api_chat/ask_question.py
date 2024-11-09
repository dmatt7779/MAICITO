
import asyncio
import re
from markdown import markdown
from bs4 import BeautifulSoup
from fastapi import Body
from fastapi import HTTPException
from services.question_answering import QuestionAnswering
from services.vector_store import VectorStore
import datetime
import concurrent.futures

question_answering = QuestionAnswering()
vector_store = VectorStore()
question_answering = QuestionAnswering()
vector_store = VectorStore()
MAX_THREADS = 4  # Adjust as needed

def process_question_worker(data: str):
    inicio = datetime.datetime.now()
    print(f"Worker iniciado: {inicio.isoformat()}")

    try:
        params_splitted = data.split('|')
        collection_name = params_splitted[0]
        question = params_splitted[1]

        retrieved_chunks = vector_store.get_relevant_documents(question, collection_name)
        answer = question_answering.generate_answer(question, retrieved_chunks)
        html_answer = formatting_response_to_html(answer)

        fin = datetime.datetime.now()
        print(f"Worker finalizado: {fin.isoformat()}")

        return {"answer": html_answer}

    except Exception as e:
        return {"error": str(e)}
    
async def ask_question(data: str = Body(...)):
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
        response = await asyncio.to_thread(process_question_worker, data)
    # response =  process_question_worker(data) # Direct call to worker function
    if "error" in response:
        raise HTTPException(status_code=500, detail=response["error"])
    
    return response

def formatting_response_to_html(jsonResponse: str):
    answer = jsonResponse

    #1. Eliminar dobles barras invertidas
    answer = re.sub(r'\(\*([^\*]+)\*\)', r'**\**', answer)
    answer = re.sub(r'\\([^\n]+)\\', r'\1*', answer)

    #2. buscar formula entre corchetes
    answer = re.sub(r'\[(.*?)\]', lambda m: format_latex(m.group(1)), answer)

    answer = re.sub(r'\*([^*\n]+)\*', r'_\1_', answer)
    answer = re.sub(r'\*\*([^*\n]+)\*\*', r'**\1**', answer)
    answer = re.sub(r'\[(.*?)\]', r'<span class="math-formula">\1</span>', answer)

    html = markdown(answer)
    soup = BeautifulSoup(html, "html.parser")

    list_items = soup.find_all('p', text=re.compile(r'^\d+\.'))
    if list_items:
        ol=soup.new_tag('ol')
        for item in list_items:
            item.string = re.sub(r'^\d+\.\s*', '', item.string)
            li = soup.new_tag('li')
            li.append(item.string)
            ol.append(li)
            item.replace_with('')
        soup.append(ol)
    return str(soup)

def format_latex(formula):
    formula = re.sub(r'\\text{(.+?)}', r'\1', formula)
    return f'<span class="math-formula">{formula}</span>'