import os
import requests
from dotenv import load_dotenv
import chromadb

load_dotenv()

class ChromaDBManager:

  def __init__(self):
    self.chroma_host = os.environ.get("CHROMA_HOST", "localhost")
    self.chroma_port = int(os.environ.get("CHROMA_PORT", "8000"))

  def is_chromadb_running(self):
    """Verifica si ChromaDB está accesible via HTTP health check."""
    try:
      url = f"http://{self.chroma_host}:{self.chroma_port}/api/v1/heartbeat"
      response = requests.get(url, timeout=5)
      if response.status_code == 200:
        print("ChromaDB está en ejecución (heartbeat OK).")
        return True
      else:
        print(f"ChromaDB respondió con status: {response.status_code}")
        return False
    except requests.exceptions.ConnectionError:
      print("ChromaDB no está accesible (connection refused).")
      return False
    except Exception as e:
      print(f"Error al verificar el estado de ChromaDB: {e}")
      return False

  def get_client(self):
    if self.is_chromadb_running():
        try:
            self.client = chromadb.HttpClient(self.chroma_host, self.chroma_port)
            return self.client
        except Exception as e:
            raise Exception(f"Error al conectar a ChromaDB: {e}, host: {self.chroma_host}, port: {self.chroma_port}")
    else:
        raise Exception("ChromaDB no está en ejecución o no es accesible.")