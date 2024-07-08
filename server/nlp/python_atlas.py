import os
from dotenv import load_dotenv
from pathlib import Path
from pymongo import MongoClient
from bson import ObjectId

# Load environment variables
env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)
database_name = os.getenv('MONGO_DATABASE_NAME')
database_connection_string = os.getenv('MONGO_CONNECTION_STRING')

class AtlasClient:
    def __init__(self, connection_string, database_name):
        self.mongodb_client = MongoClient(connection_string)
        self.database = self.mongodb_client[database_name]

    def ping(self):
        self.mongodb_client.admin.command('ping')

    def get_collection(self, collection_name):
        collection = self.database[collection_name]
        return collection

    def find(self, collection_name, filter={}, limit=0):
        collection = self.database[collection_name]
        items = list(collection.find(filter=filter, limit=limit))
        return items
    
    def insert_word_count(self, project_id, word_counts_list):
        collection = self.database['project-responses']
        collection.update_one(
            {"projectId": project_id}, 
            {"$set": {"wordCounts": word_counts_list}}
        )

    def insert_key_words_eng(self, project_id, key_words_list):
        collection = self.database['user-projects']
        collection.update_one(
            {"_id": ObjectId(project_id)}, 
            {"$set": {"keyWordsEng": key_words_list}}
        )

    def insert_key_words_cn(self, project_id, key_words_list):
        collection = self.database['user-projects']
        collection.update_one(
            {"_id": ObjectId(project_id)}, 
            {"$set": {"keyWordsCn": key_words_list}}
        )


atlas_client = AtlasClient(database_connection_string, database_name)
