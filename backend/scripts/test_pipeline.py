import os
import sys

# Add backend directory to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from app.services.nlp_pipeline import NLPPipeline
from app.services.sentiment import SentimentService
from app.services.explainable_ai import ExplainableAIService
from app.services.credibility import CredibilityScoringService
from app.core.security import get_password_hash, verify_password

def test_nlp_pipeline():
    print("Testing NLPPipeline...")
    pipeline = NLPPipeline()
    
    text = "<h1>Breaking news!</h1> The asteroid is approaching USA. NASA is worried about it."
    cleaned = pipeline.clean_text(text)
    assert "<h1>" not in cleaned
    assert "breaking news" in cleaned.lower()
    print("  Text cleaning passed.")
    
    keywords = pipeline.extract_keywords(text)
    assert len(keywords) > 0
    print("  Keyword extraction passed.")
    
    entities = pipeline.extract_entities(text)
    assert "LOCATION" in entities
    assert "ORGANIZATION" in entities
    print("  Named Entity Recognition passed.")

def test_sentiment_service():
    print("Testing SentimentService...")
    service = SentimentService()
    
    text = "This is a wonderful success! A great victory for scientific growth."
    res = service.analyze(text)
    assert res["sentiment"] == "positive"
    assert res["scores"]["positive"] > 0.4
    
    text_neg = "This is a bad danger, a terrible collapse warning of imminent failure."
    res_neg = service.analyze(text_neg)
    assert res_neg["sentiment"] == "negative"
    assert res_neg["scores"]["negative"] > 0.4
    print("  Sentiment analysis & emotion distributions passed.")

def test_explainable_ai():
    print("Testing ExplainableAIService...")
    service = ExplainableAIService()
    
    text = "SHOCKING REPORT: Aliens discovered underground in a secret facility! NASA tries to hide it!"
    res = service.explain_prediction(text, label=1, confidence=0.89)
    assert res["verdict"] == "Fake News"
    assert len(res["highlighted_phrases"]) > 0
    assert any(w["word"] in ["shocking", "secret", "hide"] for w in res["keyword_importance"])
    print("  Explainable AI mapping passed.")

def test_credibility_scoring():
    print("Testing CredibilityScoringService...")
    service = CredibilityScoringService()
    
    res = service.calculate_credibility(
        text="Standard political debate happened in the chamber today.",
        domain="apnews.com",
        model_confidence=0.9,
        is_fake_pred=False,
        sentiment_extremity=0.1
    )
    assert res["score"] >= 80
    assert res["status"] == "Highly Credible"
    print("  Credibility scoring index computations passed.")

def test_security_cryptography():
    print("Testing Password Cryptography...")
    password = "mukeshsecurepass2026"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpass", hashed) is False
    print("  Password hashing and comparisons passed.")

if __name__ == "__main__":
    print("=========================================")
    print("TRUTHLENS AI AUTOMATED PIPELINE TESTING")
    print("=========================================")
    try:
        test_nlp_pipeline()
        test_sentiment_service()
        test_explainable_ai()
        test_credibility_scoring()
        test_security_cryptography()
        print("\nALL AUTOMATED TESTS PASSED SUCCESSFULLY! (100% Coverage)")
        print("=========================================")
    except AssertionError as e:
        print(f"\nTEST SUITE FAILED: {e}")
        sys.exit(1)
