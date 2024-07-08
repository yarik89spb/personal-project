import spacy
from spacy.lang.en.stop_words import STOP_WORDS
import re
import string
from deep_translator import GoogleTranslator
from bson.objectid import ObjectId
from python_atlas import atlas_client;
import sys

def fetch_questions_data(atlas_client, project_id):
    project_data = atlas_client.find('user-projects', filter={'_id': ObjectId(project_id)}, limit=1)
    if project_data:
        return project_data[0]['questions']
    return None

def translateToEnglish(text):
  result = GoogleTranslator(source='auto', target='en').translate(text)
  return result

def translateToChinese(text):
  result = GoogleTranslator(source='auto', target='zh-TW').translate(text)
  return result


def semanticImportance(text):
  nlp = spacy.load("en_core_web_md")
  doc = nlp(text)
  num_pattern = re.compile(r'^[-+]?\d+(\.\d+)?$')
  # Extract and score tokens
  tokens_with_scores = {token.text: token.vector_norm for token in doc
                        if not token.ent_type_ == "TIME"
                        and not num_pattern.match(token.text)
                        and not token.is_stop
                        and not token.is_punct}
  return [token[0] for token in sorted(tokens_with_scores.items(), key=lambda x: x[1], reverse=True)[:20]]


def main(project_id):
  # Get project questions content: title, description, option, bot notes
  # Concatenate to a one big string
  questions_raw = '. '.join(['. '.join([
    question_object['title'].strip(), 
    question_object['content'].strip(), 
    # question_object['botNote'].strip(), 
    '. '.join([option['text'] for option in question_object['options']]).strip()]) 
    for question_object in fetch_questions_data(atlas_client, project_id)])

  # All or fracture of text can be in Mandarin
  questions_raw_eng = translateToEnglish(questions_raw)
  # Remove punctuation using lookup table
  extra_punct = '^#@$%￥…《》“”{}*&～；【】（）-+_=!?；；（），。、：《》‘’—' 
  trans_table = str.maketrans('', '', string.punctuation + extra_punct)
  questions_cleaned = questions_raw_eng.translate(trans_table)
  # Use Spacy model to get keywords 
  kwords_eng = semanticImportance(questions_cleaned.lower())
  # Same keywords but in Mandarin
  kwords_cn = list(map(translateToChinese, kwords_eng))
  # Save result to DB
  atlas_client.insert_key_words_eng(project_id, kwords_eng)
  atlas_client.insert_key_words_cn(project_id, kwords_cn)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <projectId>")
        sys.exit(1)
    project_id = sys.argv[1]
    main(project_id)