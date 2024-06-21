import os
from dotenv import load_dotenv
from pathlib import Path
from pymongo import MongoClient
import pandas as pd
import numpy as np
import jieba
import string
import stopwordsiso as sw
from collections import Counter


env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)
database_name = os.getenv('MONGO_DATABASE_NAME')
database_connection_string = os.getenv('MONGO_CONNECTION_STRING')

project_id = "c75a22fs68cgs3"
class AtlasClient ():
  def __init__ (self, connection_string, database_name):
    self.mongodb_client = MongoClient(connection_string)
    self.database = self.mongodb_client[database_name]

  ## A quick way to test if we can connect to Atlas instance
  def ping (self):
    self.mongodb_client.admin.command('ping')

  def get_collection (self, collection_name):
    collection = self.database[collection_name]
    return collection

  def find (self, collection_name, filter = {}, limit=0):
    collection = self.database[collection_name]
    items = list(collection.find(filter=filter, limit=limit))
    return items
  
  def insert_word_count (self, collection_name, project_id, word_counts_list):
    collection = self.database[collection_name]
    collection.update_one(
      {"projectId": project_id}, 
      {"$set": {"wordCounts": word_counts_list}}
      )


atlas_client = AtlasClient (database_connection_string, database_name)
project_data = atlas_client.find('project-responses', filter={'projectId':project_id}, limit=1)
# Since mongo.find always going to return array, get the first (=only) element 
project_data = project_data[0]
# Store comments in array of arrays 
comments = [q['comments'] for q in project_data['questions'] if len(q['comments']) > 0]
# Flatten to 1D array
comments_flat =  np.concatenate(comments)
# Create Pandase dataframe
comments_df = pd.DataFrame.from_records(comments_flat).set_index('_id', drop=True)
# Remove punctuation using lookup table 
extra_punct = '^#@$%￥…《》“”{}*&～；【】（）-+_=!?；；（），。、：《》‘’—' 
trans_table = str.maketrans('', '', string.punctuation + extra_punct)
# Apply translation to remove punctuation and store in new column
comments_df['text_clean'] = comments_df['text'].apply(lambda x: x.strip().translate(trans_table))
# Tokenize Chinese words
comments_df['text_split'] = comments_df['text_clean'].apply(lambda x: list(jieba.cut(x)))
custom_stopwords = (sw.stopwords("zh")).union(sw.stopwords("en")).union({
  ' ', '', '妳', '你', '他', '她', '它'})
comments_df['text_sanitized'] = comments_df['text_split'].apply(lambda x: [w for w in x if w not in custom_stopwords])

comments_all = list(np.concatenate(comments_df['text_sanitized']))
word_counts = [{"text": str(word), "value": int(count)} for word, count in Counter(comments_all).most_common(50)]

atlas_client.insert_word_count('project-responses', project_id, word_counts)