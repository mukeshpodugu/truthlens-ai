import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation

# Downloader function to guarantee availability
def ensure_nltk_resources():
    for res in ['punkt', 'stopwords', 'wordnet', 'averaged_perceptron_tagger', 'maxent_ne_chunker', 'words']:
        try:
            nltk.data.find(f'corpora/{res}' if res in ['stopwords', 'wordnet', 'words'] else f'tokenizers/{res}' if res == 'punkt' else f'taggers/{res}')
        except LookupError:
            nltk.download(res, quiet=True)

ensure_nltk_resources()

class NLPPipeline:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

    def clean_text(self, text: str) -> str:
        """Removes HTML tags, URLs, and normalizes spacing."""
        if not text:
            return ""
        text = re.sub(r'<[^>]*>', '', text)
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        text = re.sub(r'[^\w\s]', ' ', text)
        return " ".join(text.split()).strip()

    def process(self, text: str):
        """Runs the NLP pipeline returning clean text, tokens, lemmatized tokens, and POS tags."""
        cleaned = self.clean_text(text)
        tokens = word_tokenize(cleaned.lower())
        filtered_tokens = [t for t in tokens if t not in self.stop_words and len(t) > 2]
        lemmatized = [self.lemmatizer.lemmatize(t) for t in filtered_tokens]
        
        # POS Tagging
        pos_tags = nltk.pos_tag(tokens)
        
        return {
            "cleaned_text": cleaned,
            "tokens": tokens,
            "filtered_tokens": filtered_tokens,
            "lemmatized_tokens": lemmatized,
            "pos_tags": pos_tags
        }

    def extract_keywords(self, text: str, top_n=8) -> list:
        """Extracts top keywords based on term frequency and length constraints."""
        cleaned = self.clean_text(text)
        tokens = word_tokenize(cleaned.lower())
        words = [t for t in tokens if t not in self.stop_words and t.isalpha() and len(t) > 3]
        
        freq = {}
        for w in words:
            freq[w] = freq.get(w, 0) + 1
            
        sorted_keywords = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, count in sorted_keywords[:top_n]]

    def extract_entities(self, text: str) -> dict:
        """Extracts simple Named Entities (Organizations, Locations, Persons) using POS tags."""
        cleaned = self.clean_text(text)
        tokens = word_tokenize(cleaned)
        tagged = nltk.pos_tag(tokens)
        
        entities = {"PERSON": set(), "ORGANIZATION": set(), "LOCATION": set()}
        
        # Simple rule-based extraction: contiguous proper nouns (NNP/NNPS)
        current_entity = []
        for word, tag in tagged:
            if tag in ('NNP', 'NNPS'):
                current_entity.append(word)
            else:
                if current_entity:
                    entity_name = " ".join(current_entity)
                    # Classify based on dictionary matching or defaults
                    if any(loc in entity_name.lower() for loc in ['usa', 'china', 'russia', 'japan', 'uk', 'state', 'city', 'york', 'washington', 'london', 'moscow']):
                        entities["LOCATION"].add(entity_name)
                    elif any(corp in entity_name.lower() for corp in ['inc', 'corp', 'google', 'apple', 'microsoft', 'nasa', 'who', 'senate', 'government', 'fbi', 'cia', 'un']):
                        entities["ORGANIZATION"].add(entity_name)
                    else:
                        entities["PERSON"].add(entity_name)
                    current_entity = []
                    
        # Check last entity
        if current_entity:
            entity_name = " ".join(current_entity)
            entities["PERSON"].add(entity_name)
            
        return {k: list(v)[:5] for k, v in entities.items()}

    def extract_topics(self, text: str, n_topics=1) -> list:
        """Performs Topic Modeling on single text using LDA comparison."""
        cleaned = self.clean_text(text)
        if len(cleaned.split()) < 10:
            return ["General News"]
            
        try:
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf = vectorizer.fit_transform([cleaned])
            feature_names = vectorizer.get_feature_names_out()
            # Simple fallback for short texts: return top terms as topic
            indices = tfidf.toarray()[0].argsort()[-3:][::-1]
            return [feature_names[i].capitalize() for i in indices]
        except Exception:
            return ["General News"]
