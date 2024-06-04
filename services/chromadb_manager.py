import os
from dotenv import load_dotenv
import subprocess
import chromadb

load_dotenv()

class ChromaDBManager:

  def __init__(self):
    self.chroma_host = os.environ["CHROMA_HOST"]
    self.chroma_port = int(os.environ["CHROMA_PORT"])

  def is_chromadb_running(self):
    command = ["docker", "ps", "-f", "ancestor=chromadb/chroma", "--format", "{{.Status}}"]
    try:
      result = subprocess.run(command, check=True, capture_output=True, text=True)
      status = result.stdout.strip()
      if "Up" in status:
        print("Contenedor ChromaDB está en ejecución.")
        return True
      else:
        print("Contenedor ChromaDB no está en ejecución.")
        return False
    except subprocess.CalledProcessError as e:
      print(f"Error al verificar el estado del contenedor ChromaDB: {e}")
      return False

  def get_client(self):
    if self.is_chromadb_running():
        try:
            self.client = chromadb.HttpClient(self.chroma_host, self.chroma_port)
            return self.client
        except Exception as e:
            raise Exception(f"Error al conectar a ChromaDB: {e}, host: {self.chroma_host}, port: {self.chroma_port}")
    else:
        raise Exception("El contenedor ChromaDB no está en ejecución.")