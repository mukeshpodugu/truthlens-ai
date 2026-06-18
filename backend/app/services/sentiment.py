import re

# Lexicon banks for Sentiment & Emotions
SENTIMENT_LEXICON = {
    # Positive
    "great": 0.6, "wonderful": 0.8, "excellent": 0.8, "success": 0.7, "victory": 0.75,
    "approve": 0.5, "happy": 0.7, "good": 0.4, "positive": 0.5, "trust": 0.6, "support": 0.5,
    "growth": 0.45, "breakthrough": 0.8, "leads": 0.4, "benefit": 0.5, "outstanding": 0.85,
    
    # Negative
    "bad": -0.4, "worry": -0.5, "fail": -0.6, "crisis": -0.7, "danger": -0.65, "threat": -0.7,
    "disastrous": -0.85, "corrupt": -0.7, "illegal": -0.5, "scandal": -0.65, "damage": -0.55,
    "investigated": -0.4, "warning": -0.45, "collapse": -0.75, "fake": -0.5, "conspiracy": -0.6
}

EMOTION_LEXICON = {
    "joy": ["victory", "celebrate", "happy", "wonderful", "success", "achieved", "delight", "breakthrough", "gold"],
    "anger": ["furious", "outrage", "corrupt", "illegal", "betrayal", "refused", "hate", "protest", "slammed", "scandal"],
    "fear": ["threat", "danger", "warning", "panic", "collapse", "risk", "deadly", "nuclear", "war", "terror", "scared"],
    "sadness": ["mourn", "tragedy", "loss", "death", "failed", "died", "ruined", "disaster", "grief", "melancholy"],
    "surprise": ["unprecedented", "shocking", "unexpected", "astonishing", "reveals", "discovery", "suddenly", "miracle"],
    "disgust": ["gross", "revolting", "scandalous", "shameless", "abhorrent", "sickening", "vile", "hypocrisy", "cabal"]
}

class SentimentService:
    def analyze(self, text: str) -> dict:
        """
        Analyzes sentiment polarity (positive, negative, neutral)
        and detects emotion distribution (joy, anger, fear, sadness, surprise, disgust).
        """
        words = re.findall(r'\b\w+\b', text.lower())
        word_count = len(words)
        
        if word_count == 0:
            return {
                "sentiment": "neutral",
                "scores": {"positive": 0.0, "negative": 0.0, "neutral": 1.0},
                "emotions": {k: 0.0 for k in EMOTION_LEXICON.keys()},
                "dominant_emotion": "neutral"
            }
            
        # 1. Sentiment Score calculation
        pos_sum = 0.0
        neg_sum = 0.0
        
        for w in words:
            if w in SENTIMENT_LEXICON:
                val = SENTIMENT_LEXICON[w]
                if val > 0:
                    pos_sum += val
                else:
                    neg_sum += abs(val)
                    
        # Add modifier for punctuation (e.g. exclamation marks indicating extremity)
        exclamations = len(re.findall(r'!', text))
        if exclamations > 0:
            if neg_sum > pos_sum:
                neg_sum += min(1.5, exclamations * 0.25)
            else:
                pos_sum += min(1.5, exclamations * 0.25)
                
        total = pos_sum + neg_sum
        
        if total == 0:
            scores = {"positive": 0.1, "negative": 0.1, "neutral": 0.8}
        else:
            norm_pos = pos_sum / (total + 1.0)
            norm_neg = neg_sum / (total + 1.0)
            norm_neu = 1.0 - (norm_pos + norm_neg)
            scores = {
                "positive": round(norm_pos, 3),
                "negative": round(norm_neg, 3),
                "neutral": round(max(0.0, norm_neu), 3)
            }
            
        # Determine main label
        if scores["positive"] > scores["negative"] + 0.1:
            sentiment_label = "positive"
        elif scores["negative"] > scores["positive"] + 0.1:
            sentiment_label = "negative"
        else:
            sentiment_label = "neutral"
            
        # 2. Emotion Score calculation
        emotion_counts = {k: 0.0 for k in EMOTION_LEXICON.keys()}
        
        for emotion, keywords in EMOTION_LEXICON.items():
            for kw in keywords:
                # regex to check for exact keyword or root word match
                pattern = r'\b' + re.escape(kw)
                matches = len(re.findall(pattern, text.lower()))
                emotion_counts[emotion] += matches
                
        # Normalize emotion scores (0.0 - 1.0 scale)
        total_emotions = sum(emotion_counts.values())
        if total_emotions == 0:
            # default uniform baseline if no emotion words detected
            emotions = {k: round(1.0 / len(EMOTION_LEXICON), 3) for k in EMOTION_LEXICON.keys()}
            dominant_emotion = "neutral"
        else:
            emotions = {k: round(v / total_emotions, 3) for k, v in emotion_counts.items()}
            dominant_emotion = max(emotions, key=emotions.get)
            
        return {
            "sentiment": sentiment_label,
            "scores": scores,
            "emotions": emotions,
            "dominant_emotion": dominant_emotion
        }
