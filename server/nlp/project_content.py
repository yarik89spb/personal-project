import spacy
from googletrans import Translator
from deep_translator import GoogleTranslator

def translate(text):
  translator = Translator()
  result = translator.translate(text)
  print(result)

def translate2(text):
  result = GoogleTranslator(source='auto', target='en').translate(text)
  print(result)

def translate3(text):
  result = GoogleTranslator(source='auto', target='zh-TW').translate(text)
  print(result)


def semanticImportance(text):
  nlp = spacy.load("en_core_web_md")

  doc = nlp(text)

  # Extract and score tokens
  tokens_with_scores = [(token.text, token.vector_norm) for token in doc if not token.is_stop and not token.is_punct]

  # Sort tokens by score
  sorted_tokens = sorted(tokens_with_scores, key=lambda x: x[1], reverse=True)

  # Print the top N important words
  N = 5
  print("Top important words based on semantic meaning:")
  for token, score in sorted_tokens[:N]:
      print(f"Word: {token}, Score: {score}")

def wordNER(text):
  nlp = spacy.load("en_core_web_sm")
  doc = nlp(text)
  print("Named Entities in the text:")
  for ent in doc.ents:
      print(f"Text: {ent.text}, Entity Type: {ent.label_}")

text = "Overall quality is high, however feel too pricey \
  and the service was subpar"
text2 = "總是説品質很好不過有一點太貴而且服務不是很好"
text3 = "Barack Obama was born on August 4, 1961, in Honolulu, \
  Hawaii. He served as the 44th President of the United States."
semanticImportance(text)
wordNER(text3)
translate2(text2)
translate3(text)

