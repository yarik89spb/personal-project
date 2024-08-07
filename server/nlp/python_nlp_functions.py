import spacy
from spacy.lang.en.stop_words import STOP_WORDS
import re
import string
from deep_translator import GoogleTranslator
from bson.objectid import ObjectId
from python_atlas import atlas_client;

def fetch_questions_data(atlas_client, project_id):
    project_data = atlas_client.find('user-projects', filter={'_id': ObjectId(project_id)}, limit=1)
    if project_data:
        return project_data[0]['questions']
    return None

def translate2(text):
  result = GoogleTranslator(source='auto', target='en').translate(text)
  return result

def translate3(text):
  result = GoogleTranslator(source='auto', target='zh-TW').translate(text)
  print(result)


def semanticImportance(text):
  nlp = spacy.load("en_core_web_md")
  doc = nlp(text)
  num_pattern = re.compile(r'^[-+]?\d+(\.\d+)?$')
  # Extract and score tokens
  tokens_with_scores = {token.text: token.vector_norm for token in doc
                        if not token.ent_type_ == "TIME"
                        and token.text != '+'
                        and not num_pattern.match(token.text)
                        and not token.is_stop
                        and not token.is_punct}
  

  # Print the top N important words
  N = 20
  print("Top important words based on semantic meaning:")
  return [token[0] for token in sorted(tokens_with_scores.items(), key=lambda x: x[1], reverse=True)[:10]]

def wordNER(text):
  # Named-entity recognition
  nlp = spacy.load("en_core_web_sm")
  doc = nlp(text)
  print("Named Entities in the text:")
  for ent in doc.ents:
      print(f"Text: {ent.text}, Entity Type: {ent.label_}")

text = "Overall quality is high, however feel too pricey \
  and the service was subpar"
text2 = "總是説品質很好不過有一點太貴而且服務不是很好"
text22 = "...generally説品質很好不過有一點very貴而且服務不是很good!"
text3 = "Barack Obama was born on August 4, 1961, in Honolulu, \
  Hawaii. He served as the 44th President of the United States."
# semanticImportance(text)
# wordNER(text3)
# translate2(text22)
# translate3(text)

temp_project_id = '6687b8e4829a6a99c034b330'

questions_raw_text = '. '.join(['. '.join([
  question_object['title'].strip(), 
  question_object['content'].strip(), 
  question_object['botNote'].strip(), 
  '. '.join([option['text'] for option in question_object['options']]).strip()]) 
  for question_object 
  in fetch_questions_data(atlas_client, temp_project_id)])

questions_raw_text_eng = translate2(questions_raw_text)
extra_punct = '^#@$%￥…《》“”{}*&～；【】（）-+_=!?；；（），。、：《》‘’—' 
trans_table = str.maketrans('', '', string.punctuation + extra_punct)
questions_raw_text_eng_cleaned = questions_raw_text_eng.translate(trans_table)
# print(questions_raw_text_eng)
print(semanticImportance(questions_raw_text_eng_cleaned.lower()))
# wordNER(questions_raw_text_eng)