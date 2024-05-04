import re
from PyPDF2 import PdfReader
import json
import copy
from pathlib import Path

pdf_paths = [
    'C:/Users/mateo.aguilar/Downloads/Material_AVA_Prospectiva_2.pdf',
    'C:/Users/mateo.aguilar/Downloads/cuento.pdf'
    # Agrega más rutas de archivos PDF aquí si es necesario
]

"""
Variables para contenido temporal
"""
system_content = "Eres un asistente de clase para un profesor de universidad con enfasis en: Simulación y modelación empresarial."
bot_name = "Prospectiva 2 – Simulación y modelación empresarial"

output_json_path = 'Paragraphs.json'
output_txt_path = 'Paragraphs.txt'
prueba = 'prueba.json'

json_path = './Paragraphs.json'

def get_json_data(json_to_read):
    with open(json_to_read, 'r', encoding='utf-8') as file:
        data = json.load(file)
        return data

def format_key(pdf_path, page_num, paragraph_num):
    pdf_name = Path(pdf_path).stem
    return f"{pdf_name}_pagina_{page_num + 1}_parrafo_{paragraph_num + 1}"

def get_key_split(key_to_split):
    doc_name_pattern = re.compile(r"(.*?)_pagina_(\d+)_parrafo_(\d+)")
    match = doc_name_pattern.match(key_to_split)
    if match:
        doc_name = match.group(1)
        page = f"pagina {match.group(2)}"
        paragraph = f"parrafo {match.group(3)}"
        return doc_name, page, paragraph
    else:
        raise Exception("No se encontró una coincidencia con el formato esperado")

def process_pdf(pdf_paths, output_json_path, output_txt_path):
    with open(output_json_path, 'w', encoding='utf-8') as json_file, open(output_txt_path, 'w', encoding='utf-8') as txt_file:
        data = {}
        for pdf in pdf_paths:
            try:
                pdf_reader = PdfReader(pdf)
            except Exception as e:
                print(f'Error reading file: {e}')
                continue

            for page_num, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                if not text:  # Skip empty pages
                    continue
                paragraphs = re.split('  \n+', text)

                for paragraph_num, paragraph in enumerate(paragraphs):
                    paragraph = paragraph.replace("  \n", " ").replace("\n", "").strip()
                    if paragraph:
                        key = format_key(pdf, page_num, paragraph_num)
                        data[key] = paragraph
                        txt_file.write(f'["{key}", "{paragraph}"]\n')

        json.dump(data, json_file, ensure_ascii=False, indent=4)
        print(f"Paragraph data saved to: {output_json_path} and {output_txt_path}")

def get_openAi_data(json_path, prueba):
    openAi_json_template = {"messages": [{"role": "system"},{"role": "user"},{"role": "assistant"}]}
    pdf_extracted_data = get_json_data(json_path)

    with open(prueba, 'w', encoding='utf-8') as json_file:
        fine_tunning_data = []
        for key, text in pdf_extracted_data.items():
            template_copy = copy.deepcopy(openAi_json_template)
            doc_name, page, paragraph = get_key_split(key)
            for message in template_copy['messages']:

                if message['role'] == 'system':
                    message['content'] = system_content
                elif message['role'] == 'user':
                    message['content'] = f"Nucleo: {bot_name} \nDocumento: {doc_name} \nPagina: {page} \nParrafo: {paragraph}"
                elif message['role'] == 'assistant':
                    message['content'] = f"{text}"
                else:
                    print("ERROR")
                
            fine_tunning_data.append(template_copy)
        json.dump(fine_tunning_data, json_file, ensure_ascii=False, indent=4)

process_pdf(pdf_paths, output_json_path, output_txt_path)
get_openAi_data(json_path, prueba)