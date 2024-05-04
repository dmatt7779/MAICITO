import streamlit as st
from streamlit_chat import message
import os
import Chromadb
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from langchain.document_loaders import DirectoryLoader
from langchain_openai import OpenAI
from old_code.semantic import get_chunks_from_pdf
from old_code.semantic import Document
from langchain_openai import ChatOpenAI

chunks = get_chunks_from_pdf('/Users/luciacastanomarin/Documents/AI_chatbotPDF/chatbotAI/Material_AVA_Prospectiva_2.pdf')

# Título de la aplicación
st.title("Chatbot con Carga de PDF")

# output_txt_path = 'Paragraphs.txt'

OPENAI_API_KEY = "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"
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
openai = ChatOpenAI(model_name = "gpt-3.5-turbo-0125")

# Embed and store the texts
# Supplying a persist_directory will store the embeddings on disk
persist_directory = 'db'

## here we are using OpenAI embeddings
embedding = OpenAIEmbeddings()
vectordb = Chroma.from_documents(documents=chunks,
                                 embedding=embedding,
                                 persist_directory=persist_directory)
# persiste the db to disk
vectordb.persist()
vectordb = None

# Now we can load the persisted database from disk, and use it as normal.
vectordb = Chroma(persist_directory=persist_directory,
                  embedding_function=embedding)


#Creating the session_state keys - streamlit
if 'responses' not in st.session_state:
    st.session_state['responses'] = ["¡Hola!, ¿En que puedo ayudarte?"]

    
#cargar el documento en el sidebar
st.sidebar.markdown("<h1 style='text-align: center; color: #176B87;'> Cargar Archivo PDF</h1>", unsafe_allow_html=True)
st.sidebar.write("Cargar el archivo .pdf con el cual quieres interactuar")
# pdf_doc = st.sidebar.file_uploader(loader, type="pdf")
st.sidebar.write("----")
clear_btn = st.sidebar.button("Limpiar Conversación", key="clear")
# embeddings_pdf = create_embeddings(pdf_doc, output_txt_path)
# embeddings_pdf = create_embeddings(output_txt_path)

#CHAT Section
st.markdown("<h2 style='text-align: center; color: #176B87; text-decoration: underline;'><strong>Interactua con el BOT sobre tu documento</strong>", unsafe_allow_html=True)
st.sidebar.write("----")

#Container del chat history
response_container = st.container()

#Container del text Box
text_container = st.container()

#Creando el campo para el ingreso de la pregunta del usuario
with text_container:
    #Formulario del text input
    with st.form(key='my_form', clear_on_submit=True):
        query = st.text_area("Tu:", key='input', height=100)
        submit_button = st.form_submit_button(label='Enviar')
        print(query)

    if query:
        with st.spinner("Escribiendo..."):
            #Make the Retriever
            retriever = vectordb.as_retriever()
            docs = retriever.get_relevant_documents("cual es el nombre del nucleo?")
            retriever = vectordb.as_retriever(search_kwargs={"k": 2})

            #Make a chain
            qa_chain = RetrievalQA.from_chain_type(
                llm=openai,
                chain_type="stuff",
                retriever=retriever,
                return_source_documents=True
            )
            
            # full example
            llm_response = qa_chain(query)

        print(f"llm_response -> {llm_response}")
        st.session_state.responses.append(llm_response)

#Configurando el repsonse container    
with response_container:
    if st.session_state['responses']:
        print(f"Responses -> {st.session_state['responses']}")
        message(st.session_state['responses'][0], avatar_style="pixel-art")
        if (len(st.session_state['responses'])) > 1:
            for i in st.session_state['responses'][1:]:
                message(i['query'], is_user=True, avatar_style="_user")
                message(i['result'], avatar_style="pixel-art")
                # message(st.session_state['responses'][i]['result'],key=str(i), avatar_style="pixel-art")
                # message(st.session_state["responses"][i]['query'], is_user=True,key=str(i)+ '_user')
