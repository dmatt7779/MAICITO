import os
import re
from typing import List, Dict
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

class QuestionAnswering:
    def __init__(self):
        self.llm = ChatOpenAI(model_name="gpt-5.1", temperature=0)
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """Eres UBI, un Catedrático Senior Multidisciplinario de CEIPA con décadas de experiencia académica a nivel superior. Tu rol es actuar como un profesor experto, dedicado y pedagógico.

            === 1. EVALUACIÓN DE INTENCIÓN ===
            - CASO A (Saludos o charla casual): Si el usuario dice "Hola", "Buenos días", "¿Cómo estás?", etc., RESPONDE ÚNICAMENTE CON UN SALUDO CORTO, amable y motivador (máximo 2 líneas). NO uses el contexto, NO des explicaciones largas. Pregunta en qué puedes apoyarlo hoy.
            - CASO B (Consulta académica): Si el usuario hace una pregunta sobre un tema, concepto o situación, responde usando el contexto proporcionado y aplicando el formato detallado abajo.

            === 2. FORMATO ESTRICTO (MARKDOWN PURO) ===
            Estás operando en un sistema que SOLO entiende Markdown puro y LaTeX. 
            ESTÁ ESTRICTAMENTE PROHIBIDO:
            - Usar CUALQUIER etiqueta HTML (ej. <p>, <div>, <span>, <br>, <h2>, <em>, <strong>).
            - Usar bloques de código para envolver la respuesta (ej. ``` o ```markdown).
            - Inventar comandos LaTeX o mezclar Markdown con LaTeX (ej. PROHIBIDO usar *cdot, \VF, \VP, \i).

            REGLAS PARA TEXTO:
            - Usa ## para títulos principales.
            - Usa **texto** para negritas.
            - Usa *texto* para cursivas.
            - Usa guiones (-) para listas no ordenadas.
            - Usa doble salto de línea para separar párrafos.

            REGLAS PARA MATEMÁTICAS (LATEX):
            - Fórmulas en línea: Usa $variable$. (Ejemplo: El capital inicial es $VP$).
            - Fórmulas en bloque (separadas del texto): Usa $$formula$$.
            - Usa SIEMPRE la barra invertida estandar de LaTeX para comandos y simbolos matematicos (\cdot, \mu, \sigma, \frac, \sqrt).
            - NO uses barra invertida para variables normales. (Ejemplo CORRECTO: $VF = VP \cdot i$. Ejemplo INCORRECTO: $\VF = \VP \cdot \i$).

            === 3. ESTRUCTURA DE RESPUESTA ACADÉMICA (Solo Caso B) ===
            1. Respuesta directa y clara (1 o 2 párrafos).
            2. Explicación pedagógica profunda (2 o 3 párrafos).
            3. Aplicación en una situación real (entornos VUCA).
            4. Resumen breve o punto clave.

            === 4. PROTOCOLO DE PRECISIÓN Y PRIVACIDAD ===
            - Basa tus respuestas ÚNICAMENTE en el contenido de la biblioteca de referencia proporcionada. Si no está, indícalo.
            - No reveles nombres de archivos, extensiones ni rutas.
            """),

            ("user", """📚 BIBLIOTECA DE REFERENCIA (CONTEXTO):
            {documents_text}

            PREGUNTA DEL ESTUDIANTE:
            {question}

            PROFESOR: Analice la intención del estudiante y responda adecuadamente siguiendo estrictamente las reglas de formato.""")
        ])
        self.output_parser = StrOutputParser()
        self.chain = self.prompt | self.llm | self.output_parser

    def _clean_html_to_markdown(self, text: str) -> str:
        """Convierte HTML residual del LLM a Markdown puro de forma agresiva."""
        # 1. Convertir Encabezados HTML a Markdown
        text = re.sub(r'<h1[^>]*>(.*?)</h1>', r'# \1\n\n', text, flags=re.IGNORECASE)
        text = re.sub(r'<h2[^>]*>(.*?)</h2>', r'## \1\n\n', text, flags=re.IGNORECASE)
        text = re.sub(r'<h3[^>]*>(.*?)</h3>', r'### \1\n\n', text, flags=re.IGNORECASE)
        
        # 2. Convertir Listas HTML a Markdown
        text = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1\n', text, flags=re.IGNORECASE)
        text = re.sub(r'</?(ul|ol)[^>]*>', '\n', text, flags=re.IGNORECASE)
        
        # 3. Convertir Formato en Línea a Markdown
        text = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', text, flags=re.IGNORECASE)
        text = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', text, flags=re.IGNORECASE)
        text = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', text, flags=re.IGNORECASE)
        text = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', text, flags=re.IGNORECASE)
        
        # 4. Manejar Párrafos, Saltos y Líneas
        text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
        text = re.sub(r'<hr\s*/?>', '\n---\n', text, flags=re.IGNORECASE)
        text = re.sub(r'</p>', '\n\n', text, flags=re.IGNORECASE)
        
        # 5. Eliminar cualquier etiqueta HTML restante (como <p>, <div>, <span>)
        text = re.sub(r'<[^>]+>', '', text)
        
        # 6. Limpieza de alucinaciones Markdown y LaTeX
        text = text.replace("```html", "").replace("```markdown", "").replace("```", "")
        # Corregir asterisco en lugar de barra para comandos LaTeX (ej. *cdot -> \cdot)
        text = re.sub(r'\*([a-zA-Z]+)\b', r'\\\1', text)
        # Limpiar variables escapadas erróneamente (ej. \VF -> VF, asegurando que no toque comandos reales como \cdot)
        text = re.sub(r'\\(VF|VP|VA|I|n|i|P)(?!\w)', r'\1', text)
        
        # 7. Normalizar espacios en blanco (eliminar múltiples saltos de línea consecutivos)
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        return text.strip()

    def generate_answer(self, question: str, retrieved_chunks: List[Dict[str, str]]) -> str:
        documents_text = "\n\n".join([chunk.get('text', '') for chunk in retrieved_chunks])

        if not documents_text.strip():
            documents_text = "Sin documentos disponibles en este momento."

        try:
            raw_answer = self.chain.invoke({
                "question": question, 
                "documents_text": documents_text
            })
            
            # Aplicar la limpieza agresiva
            clean_answer = self._clean_html_to_markdown(raw_answer)
            
            return clean_answer
            
        except Exception as e:
            return f"Hubo un error al procesar la consulta académica: {str(e)}"