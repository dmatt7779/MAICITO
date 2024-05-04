from fastapi import Depends
from services.question_answering import QuestionAnswering
from services.vector_store import VectorStore

question_answering = QuestionAnswering()

async def ask_question(question: str, vector_store: VectorStore = Depends()):
    # Retrieve relevant chunks
    retrieved_chunks = vector_store.get_relevant_documents(question)

    # Generate answer using LLM
    answer = question_answering.generate_answer(question, retrieved_chunks)

    return {"answer": answer}