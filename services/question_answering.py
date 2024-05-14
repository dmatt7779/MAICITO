import os
from typing import List, Dict
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

class QuestionAnswering:
    def __init__(self):
        self.llm = ChatOpenAI(model_name="gpt-3.5-turbo")
        self.prompt = ChatPromptTemplate.from_template("Responde la pregunta: {question}, basado en los documentos: {documents}")
        self.output_parser = StrOutputParser()
        self.chain = self.prompt | self.llm | self.output_parser

    def generate_answer(self, question: str, retrieved_chunks: List[Dict[str, str]]) -> str:
        # Convert each retrieved chunk into a Document object
        documents = [Document(page_content=chunk['text'], metadata=chunk['metadata']) for chunk in retrieved_chunks]

        # Use the chain to generate the answer
        answer = self.chain.invoke({"question": question, "documents": documents})
        return answer