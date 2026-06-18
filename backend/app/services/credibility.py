import re

# Simple domain trust registry
TRUSTED_DOMAINS = {
    "reuters.com": 98, "apnews.com": 98, "bbc.co.uk": 95, "bbc.com": 95,
    "nytimes.com": 92, "washingtonpost.com": 90, "wsj.com": 95, "bloomberg.com": 94,
    "npr.org": 93, "republican-voice.net": 25, "freedom-news.xyz": 15,
    "alien-reveals.co.uk": 5, "conspiracy-theory.org": 10
}

class CredibilityScoringService:
    def calculate_credibility(self, 
                              text: str, 
                              domain: str, 
                              model_confidence: float, 
                              is_fake_pred: bool,
                              sentiment_extremity: float) -> dict:
        """
        Calculates a credibility score from 0 to 100.
        is_fake_pred: True if model predicted Fake/Misleading
        sentiment_extremity: value between 0.0 and 1.0 (difference from neutral)
        """
        # 1. Base Score from Model Prediction
        if is_fake_pred:
            base_score = 100 - (model_confidence * 75)  # Max deduction of 75
        else:
            base_score = 40 + (model_confidence * 50)   # Max score of 90
            
        # 2. Source Domain Trust Score
        domain_modifier = 0
        domain_status = "Unverified Source"
        
        if domain:
            domain_clean = domain.lower().replace("www.", "").strip()
            if domain_clean in TRUSTED_DOMAINS:
                trust_value = TRUSTED_DOMAINS[domain_clean]
                domain_status = "Highly Reliable" if trust_value >= 90 else "Questionable Reliability" if trust_value <= 50 else "Moderately Reliable"
                domain_modifier = (trust_value - 50) * 0.4  # Ranges from -20 to +19.2
            else:
                domain_modifier = 0  # Unverified domain has neutral impact
                
        # 3. Readability & Language Quality Score
        words = text.split()
        word_count = len(words)
        caps_ratio = len([w for w in words if w.isupper() and len(w) > 3]) / max(1, word_count)
        
        language_score = 10.0
        if caps_ratio > 0.15:
            language_score -= 5.0 # Penalty for excessive capitalization
        if word_count < 20:
            language_score -= 3.0 # Too short to establish credibility
            
        # 4. Sentiment Extremity Penalty
        # Extremity close to 1.0 (extremely positive/negative) reduces credibility
        sentiment_penalty = sentiment_extremity * 12.0 # Max deduction of 12
        
        # Aggregate score
        final_score = base_score + domain_modifier + language_score - sentiment_penalty
        final_score = max(0, min(100, int(round(final_score))))
        
        # Categorize status
        if final_score >= 80:
            status = "Highly Credible"
        elif final_score >= 60:
            status = "Likely Reliable"
        elif final_score >= 40:
            status = "Partially Credible / Mixed"
        elif final_score >= 20:
            status = "Low Credibility"
        else:
            status = "Unreliable / Fake Content"
            
        return {
            "score": final_score,
            "status": status,
            "breakdown": {
                "base_prediction_contribution": round(base_score, 1),
                "source_trust_modifier": round(domain_modifier, 1),
                "language_quality_index": round(language_score, 1),
                "sentiment_bias_penalty": -round(sentiment_penalty, 1)
            },
            "source_status": domain_status
        }
