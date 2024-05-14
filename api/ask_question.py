from fastapi import HTTPException
from services.question_answering import QuestionAnswering
from services.vector_store import VectorStore

question_answering = QuestionAnswering()
vector_store = VectorStore()

async def ask_question(question: str, collection_name: str):
    try:
        # Retrieve relevant chunks
        retrieved_chunks = vector_store.get_relevant_documents(question, collection_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error Retrieving Relevant Documents: {e}")
    
    try:
        # Generate answer using LLM
        answer = question_answering.generate_answer(question, retrieved_chunks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error Generating Answer: {e}")
   
    return {"answer": answer}