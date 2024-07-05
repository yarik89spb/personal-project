import pandas as pd
import numpy as np
import jieba
import string
import stopwordsiso as sw
from collections import Counter
import sys
from python_atlas import atlas_client

def fetch_comments_data(atlas_client, project_id):
    project_data = atlas_client.find('project-responses', filter={'projectId': project_id}, limit=1)
    if project_data:
        return project_data[0]
    return None

def process_comments_and_generate_word_counts(comments):
    # Remove punctuation using lookup table
    extra_punct = '^#@$%￥…《》“”{}*&～；【】（）-+_=!?；；（），。、：《》‘’—' 
    trans_table = str.maketrans('', '', string.punctuation + extra_punct)
    
    # Create Pandas dataframe
    comments_df = pd.DataFrame.from_records(comments).set_index('_id', drop=True)
    
    # Apply translation to remove punctuation and store in new column
    comments_df['text_clean'] = comments_df['text'].apply(lambda x: x.strip().translate(trans_table))
    
    # Tokenize Chinese words
    comments_df['text_split'] = comments_df['text_clean'].apply(lambda x: list(jieba.cut(x)))
    
    # Define stopwords
    custom_stopwords = (sw.stopwords("zh")).union(sw.stopwords("en")).union({
        ' ', '', '妳', '你', '他', '她', '它'})
    
    # Sanitize text
    comments_df['text_sanitized'] = comments_df['text_split'].apply(lambda x: [w for w in x if w not in custom_stopwords])
    
    comments_all = list(np.concatenate(comments_df['text_sanitized']))
    
    # Generate word counts
    word_counts = [{"text": str(word), "value": int(count)} for word, count in Counter(comments_all).most_common(50)]
    
    return word_counts

def main(project_id):
    
    # Fetch project data
    project_data = fetch_comments_data(atlas_client, project_id)
    
    if not project_data:
        print(f"No data found for project_id: {project_id}")
        return
    
    # Store comments in array of arrays
    comments = [q['comments'] for q in project_data['questions'] if len(q['comments']) > 0]
    
    # Flatten to 1D array
    comments_flat = np.concatenate(comments)
    
    # Generate word counts
    word_counts = process_comments_and_generate_word_counts(comments_flat)
    
    # Insert word counts into database
    atlas_client.insert_word_count('project-responses', project_id, word_counts)

# Example usage
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <projectId>")
        sys.exit(1)
    project_id = sys.argv[1]
    main(project_id)
