import re
import os
from typing import List, Callable, Dict
from PyPDF2 import PdfReader
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from langchain_openai import OpenAIEmbeddings
os.environ["OPENAI_API_KEY"] = "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"

class PDFProcessor:
    def __init__(self, chunking_strategy: str = "word_count", chunk_size: int = 800):
        self.embedding_model = OpenAIEmbeddings()
        self.chunking_strategy = chunking_strategy
        self.chunk_size = chunk_size

    def process(self, pdf_content: bytes, document_name: str, course_name: str) -> List[Dict]:
        # Extract text from PDF
        raw_text = self._extract_text(pdf_content)

        # Clean and preprocess text
        cleaned_text = self._clean_text(raw_text)

        # Chunk the text
        text_chunks = self._chunk_text(cleaned_text, document_name, course_name)

        return text_chunks

    def _extract_text(self, pdf_content: bytes) -> str:
        pdf_reader = PdfReader(pdf_content)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text

    def _clean_text(self, text: str) -> str:
        text = re.sub(r'\s+', ' ', text)  # Remove extra whitespace
        text = text.strip()
        return text

    def _chunk_text(self, text: str, document_name: str, course_name: str) -> List[Dict]:
        if self.chunking_strategy == "word_count":
            return self._chunk_by_word_count(text, document_name, course_name)
        elif self.chunking_strategy == "semantic":
            return self._chunk_semantically(text)
        else:
            raise ValueError("Invalid chunking strategy")

    def _chunk_by_word_count(self, text: str, document_name: str, course_name: str) -> List[dict]:
        words = text.split()
        chunks = []
        for i in range(0, len(words), self.chunk_size):
            chunk_text = " ".join(words[i : i + self.chunk_size])
            chunks.append({
                "text": chunk_text,
                "metadata": {
                    "document_name": document_name,
                    "course_name": course_name
                },
                "id": f"id{i//self.chunk_size}"
            })
            # break in the 10 iteration:
            if i//self.chunk_size == 10:
                break
        
        return chunks

    def _chunk_semantically(self, text: str) -> List[dict]:
        sentences = [{"sentence": sent} for sent in re.split(r'(?<!vs.)(?<=[.])\s+|\n', text) if sent.strip()]

        # Combine sentences
        def combine_sentences(sentences, buffer_size=1):
            for i in range(len(sentences)):
                combined_sentence = ""
                for j in range(i - buffer_size, i + buffer_size + 1):
                    if 0 <= j < len(sentences):
                        combined_sentence += sentences[j]["sentence"] + " "
                sentences[i]["combined_sentence"] = combined_sentence.strip()
            return sentences

        sentences = combine_sentences(sentences)

        # Embed sentences
        embeddings = self.embedding_model.embed_documents([s["combined_sentence"] for s in sentences])
        for i, embedding in enumerate(embeddings):
            sentences[i]["embedding"] = embedding

        # Calculate cosine distances
        distances = []
        for i in range(len(sentences) - 1):
            dist = 1 - cosine_similarity([sentences[i]["embedding"]], [sentences[i + 1]["embedding"]])[0][0]
            distances.append(dist)

        # Determine breakpoints
        breakpoint_threshold = np.percentile(distances, 88)
        breakpoints = [i for i, d in enumerate(distances) if d > breakpoint_threshold]

        # Group sentences into chunks
        chunks = []
        start_idx = 0
        for breakpoint in breakpoints:
            chunks.append({"text": " ".join([s["sentence"] for s in sentences[start_idx : breakpoint + 1]])})
            start_idx = breakpoint + 1
        if start_idx < len(sentences):
            chunks.append({"text": " ".join([s["sentence"] for s in sentences[start_idx:]])})

        return chunks