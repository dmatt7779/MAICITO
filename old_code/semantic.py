import os
os.environ["OPENAI_API_KEY"] = "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"
from langchain_openai import OpenAIEmbeddings
import numpy as np
import PyPDF2
import re
from collections import namedtuple
from langchain_core.documents import Document


# DATA SPLITTING AND CLEANING
def get_chunks_from_pdf(path):
  
  # verify if .txt file exists and has data in it, open the .txt file and return the data as chunks variable
  if os.path.exists('botname_file.txt'):
    with open('botname_file.txt', 'r') as f:
      chunks = f.readlines()
      chunks2 = []
      for chunk in chunks:
        doc = Document(page_content=chunk,metadata={"source":"source_metadata"})
        chunks2.append(doc)
        return chunks2
    return chunks
  
  # Open the PDF file
  pdf_file = open(path, 'rb')

  # Create a PDF reader object
  pdf_reader = PyPDF2.PdfReader(pdf_file)

  # Create a list to store the text from the PDF
  pdf_text = []

  # Loop through each page in the PDF
  for page_number in range(len(pdf_reader.pages)):
    # Extract the text from the page
    text = pdf_reader.pages[page_number].extract_text()
    
    # Splitting the essay on '.' and '\n' characters and I need to exclude this 'vs.'
    text = re.split(r'(?<!vs.)(?<=[.])\s+|\n', text)
    
    # Remove the '\n' characters and trim the text
    text = [i.replace('\n', '').strip() for i in text]
    
    # Remove the empty strings
    text = [i for i in text if i != '']
    
    # Add the text to the list
    for i in text:
      pdf_text.append(i)
    if page_number == 8:
      break
    
  # Close the PDF file
  pdf_file.close()

  # Let's supose we have a list of text like this ['sentence 1.', 'sentence 2', 'sentence 3.', 'sentence 4.']
  # I need to join the sentences that are not ending with r'(?<=[.?!])\s+' with the next sentence in a new list
  # The new list should look like this ['sentence 1.', 'sentence 2 sentence 3.', 'sentence 4.']

  # Create a new list to store the joined sentences
  pdf_text_new = []
  text_new_sentence = ''

  for i in pdf_text:
    if i[-1] in ['.']:
      if text_new_sentence == '':
        r = text_new_sentence
      else:
        r = text_new_sentence + ' ' + i
        text_new_sentence = ''
      if r != '':
        pdf_text_new.append(r)
    else:
      if text_new_sentence == '':
        text_new_sentence = i
      else:
        text_new_sentence += ' ' + i

  # turn this into a list of dictionaries (List[dict]), of which, the sentences will be a key-value. 
  # Then we can start to add more data to each sentence.
  sentences = [{'sentence': x, 'index': i} for i, x in enumerate(pdf_text_new)]

  # Great, now that we have our sentences, I want to combine the sentence before and after 
  # so that we reduce noise and capture more of the relationships between sequential sentences.

  def combine_sentences(sentences, buffer_size=1):
    # Go through each sentence dict
    for i in range(len(sentences)):
      # Create a string to store the combined sentences
      combined_sentence = ''
      
      # Add the previous sentences to the combined sentence
      for j in range(i - buffer_size, i):
        # check if the index is not negative
        if j >= 0:
          # Add the sentence to the combined sentence
          combined_sentence += sentences[j]['sentence'] + ' '
          
      # Add the current sentence to the combined sentence
      combined_sentence += sentences[i]['sentence']
      
      # Add the next sentences to the combined sentence
      for j in range(i + 1, i + buffer_size + 1):
        # check if the index is not out of range
        if j < len(sentences):
          # Add the sentence to the combined sentence
          combined_sentence += ' ' + sentences[j]['sentence']
          
      # Update the current sentence with the combined sentence
      sentences[i]['combined_sentence'] = combined_sentence
      
    return sentences

  # Combine the sentences
  sentences = combine_sentences(sentences, buffer_size=1)

  # Print the text from the PDF
  # print(f'SENTENCES AQUI ---> {sentences[:3]}\n')

  # EMBEDDINGS
  # Let's get our embeddings
  oai_embeddings = OpenAIEmbeddings()
  embeddings = oai_embeddings.embed_documents([x['combined_sentence'] for x in sentences])
  # embeddings = client.embeddings.create(input = [x['combined_sentence'] for x in sentences], model="text-embedding-3-small").data[0].embedding
  # embeddings = np.array(embeddings).reshape(-1, 1)
  # print(f'\nEmbeddings AQUI ---> {embeddings[:3]}')

  # Add the embeddings to the sentences
  for i, sentence in enumerate(sentences):
    sentence['combined_sentence_embedding'] = embeddings[i]
    
  # Get the cosine distance between the sequential embedding pairs
  # We'll add 'distance_to_next' as another key

  from sklearn.metrics.pairwise import cosine_similarity

  def get_cosine_distances(sentences):
    distances = []
    for i in range(len(sentences) - 1):
      embedding_current = sentences[i]['combined_sentence_embedding']
      embedding_next = sentences[i + 1]['combined_sentence_embedding']
      
      # Calculate the cosine similarity
      similarity = cosine_similarity([embedding_current], [embedding_next])[0][0]
      
      # Convert the cosine similarity to a distance
      distance = 1 - similarity
      
      # Add the distance to the list
      distances.append(distance)
      
      # Store the distance in the dict
      sentences[i]['distance_to_next'] = distance
      
    # Handle the last sentence
    sentences[-1]['distance_to_next'] = 0
    
    return sentences, distances

  # Get the cosine distances
  sentences, distances = get_cosine_distances(sentences)

  # Print the first 3 sentences
  # print(sentences[:3])

  # Print the 'distance_to_next' for each sentence
  # for sentence in sentences:
      # print(sentence['distance_to_next'])

  import matplotlib.pyplot as plt

  plt.plot(distances)


  ## PLOTTING

  y_upper_bound = .2
  plt.ylim(0, y_upper_bound)
  plt.xlim(0, len(distances))

  # We need to get the distance threshold that we'll consider an outlier
  # We'll use numpy .percentile() for this
  breakpoint_percentile_threshold = 88 # The higher the percentile, the fewer chunks you'll get
  breakpoint_distance_threshold = np.percentile(distances, breakpoint_percentile_threshold) # If you want more chunks, lower the percentile cutoff
  plt.axhline(y=breakpoint_distance_threshold, color='r', linestyle='-');

  # Then we'll see how many distances are actually above this one
  num_distances_above_theshold = len([x for x in distances if x > breakpoint_distance_threshold]) # The amount of distances above your threshold
  plt.text(x=(len(distances)*.01), y=y_upper_bound/50, s=f"{num_distances_above_theshold + 1} Chunks");

  # Then we'll get the index of the distances that are above the threshold. This will tell us where we should split our text
  indices_above_thresh = [i for i, x in enumerate(distances) if x > breakpoint_distance_threshold] # The indices of those breakpoints on your list

  # Start of the shading and text
  colors = ['b', 'g', 'r', 'c', 'm', 'y', 'k']
  for i, breakpoint_index in enumerate(indices_above_thresh):
      start_index = 0 if i == 0 else indices_above_thresh[i - 1]
      end_index = breakpoint_index if i < len(indices_above_thresh) - 1 else len(distances)

      plt.axvspan(start_index, end_index, facecolor=colors[i % len(colors)], alpha=0.25)
      plt.text(x=np.average([start_index, end_index]),
              y=breakpoint_distance_threshold + (y_upper_bound)/ 20,
              s=f"Chunk #{i}", horizontalalignment='center',
              rotation='vertical')

  # # Additional step to shade from the last breakpoint to the end of the dataset
  if indices_above_thresh:
      last_breakpoint = indices_above_thresh[-1]
      if last_breakpoint < len(distances):
          plt.axvspan(last_breakpoint, len(distances), facecolor=colors[len(indices_above_thresh) % len(colors)], alpha=0.25)
          plt.text(x=np.average([last_breakpoint, len(distances)]),
                  y=breakpoint_distance_threshold + (y_upper_bound)/ 20,
                  s=f"Chunk #{i+1}",
                  rotation='vertical')

  plt.title("PG Essay Chunks Based On Embedding Breakpoints")
  plt.xlabel("Index of sentences in essay (Sentence Position)")
  plt.ylabel("Cosine distance between sequential sentences")
  plt.show()

  ## combine the sentences into chunks
  # Initialize the start index
  start_index = 0

  # Create a list to hold the grouped sentences
  chunks = []

  # Iterate through the breakpoints to slice the sentences
  for index in indices_above_thresh:
      # The end index is the current breakpoint
      end_index = index

      # Slice the sentence_dicts from the current start index to the end index
      group = sentences[start_index:end_index + 1]
      combined_text = ' '.join([d['sentence'] for d in group])
      source_metadata = {'source': 'Material Ava pdf 2'}
      # Crear un namedtuple Document con el texto combinado y la metadata.
      # doc = Document(combined_text, source_metadata)

      doc = Document(page_content=combined_text,metadata=source_metadata)

      # Agregar el objeto Document a la lista de documentos
      chunks.append(doc)
      
      # Update the start index for the next group
      start_index = index + 1

  # The last group, if any sentences remain
  if start_index < len(sentences):
    combined_text = ' '.join([d['sentence'] for d in sentences[start_index:]])
    doc = Document(page_content=combined_text,metadata=source_metadata)
    chunks.append(doc)

  # grouped_sentences now contains the chunked sentences

  # Print the first chunk
  # print(chunks[0])
    
  # write a .txt file with the chunks
  with open('botname_file.txt', 'w') as f:
    for chunk in chunks:
      f.write(chunk.page_content + '\n')
  return chunks

from typing import List, Dict, Any

def group_sentences(sentences: List[Dict[str, Any]], indices_above_thresh: List[int]) -> List[Document]:
  # Create a list to hold the grouped sentences
  chunks = []

  # Initialize start index
  start_index = 0

  # Iterate through the breakpoints to slice the sentences
  for index in indices_above_thresh:
    # The end index is the current breakpoint
    end_index = index

    # Slice the sentence_dicts from the current start index to the end index
    group = sentences[start_index:end_index + 1]
    combined_text = ' '.join([d['sentence'] for d in group])
    source_metadata = {'source': 'Material Ava pdf 2'}

    doc = Document(page_content=combined_text,metadata=source_metadata)

    # Add the Document object to the list of documents
    chunks.append(doc)
    
    # Update the start index for the next group
    start_index = index + 1

  # The last group, if any sentences remain
  if start_index < len(sentences):
    combined_text = ' '.join([d['sentence'] for d in sentences[start_index:]])
    doc = Document(page_content=combined_text,metadata=source_metadata)
    chunks.append(doc)

  return chunks