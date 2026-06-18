from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr

from app.core.database import Base

# ==========================================
# SQLAlchemy Declarative Models
# ==========================================

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(String(20), default="user")  # visitor, user, admin
    is_active = Column(Boolean, default=True)
    date_joined = Column(DateTime, default=datetime.utcnow)
    
    articles = relationship("NewsArticle", back_populates="user")
    saved_reports = relationship("SavedReport", back_populates="user")
    logs = relationship("ActivityLog", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)  # Politics, Technology, etc.
    
    articles = relationship("NewsArticle", back_populates="category")

class NewsArticle(Base):
    __tablename__ = "news_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    text = Column(Text, nullable=False)
    source_url = Column(String(500), nullable=True)
    publisher = Column(String(100), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="articles")
    category = relationship("Category", back_populates="articles")
    predictions = relationship("Prediction", back_populates="article", cascade="all, delete-orphan")
    sentiments = relationship("Sentiment", back_populates="article", cascade="all, delete-orphan")
    emotions = relationship("Emotion", back_populates="article", cascade="all, delete-orphan")
    credibility_scores = relationship("CredibilityScore", back_populates="article", cascade="all, delete-orphan")
    saved_reports = relationship("SavedReport", back_populates="article", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("news_articles.id"), nullable=False)
    model_name = Column(String(50), nullable=False)
    label = Column(String(50), nullable=False)  # Real News, Fake News, Misleading, Satire, Partially True
    confidence_score = Column(Float, nullable=False)
    prediction_time_ms = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    article = relationship("NewsArticle", back_populates="predictions")

class Sentiment(Base):
    __tablename__ = "sentiments"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("news_articles.id"), nullable=False)
    label = Column(String(20), nullable=False)  # positive, negative, neutral
    pos_score = Column(Float, nullable=False)
    neg_score = Column(Float, nullable=False)
    neu_score = Column(Float, nullable=False)
    
    article = relationship("NewsArticle", back_populates="sentiments")

class Emotion(Base):
    __tablename__ = "emotions"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("news_articles.id"), nullable=False)
    dominant_emotion = Column(String(20), nullable=False)
    joy = Column(Float, nullable=False)
    anger = Column(Float, nullable=False)
    fear = Column(Float, nullable=False)
    sadness = Column(Float, nullable=False)
    surprise = Column(Float, nullable=False)
    disgust = Column(Float, nullable=False)
    
    article = relationship("NewsArticle", back_populates="emotions")

class CredibilityScore(Base):
    __tablename__ = "credibility_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("news_articles.id"), nullable=False)
    score = Column(Integer, nullable=False)  # 0 to 100
    status = Column(String(50), nullable=False)  # Highly Credible, etc.
    base_prediction_score = Column(Float, nullable=False)
    source_trust_modifier = Column(Float, nullable=False)
    language_quality_score = Column(Float, nullable=False)
    sentiment_bias_penalty = Column(Float, nullable=False)
    
    article = relationship("NewsArticle", back_populates="credibility_scores")

class SavedReport(Base):
    __tablename__ = "saved_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("news_articles.id"), nullable=False)
    title = Column(String(200), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="saved_reports")
    article = relationship("NewsArticle", back_populates="saved_reports")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(200), nullable=False)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="logs")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="notifications")


# ==========================================
# Pydantic Schemas (DTOs)
# ==========================================

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    date_joined: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# Analysis requests
class AnalyzeRequest(BaseModel):
    text: str
    title: Optional[str] = "Untitled Article"
    source_url: Optional[str] = None
    publisher: Optional[str] = None
    category: Optional[str] = "General"
    model_name: Optional[str] = "LogisticRegression"

# Report structures
class SavedReportCreate(BaseModel):
    article_id: int
    title: str
    notes: Optional[str] = None

class SavedReportResponse(BaseModel):
    id: int
    title: str
    notes: Optional[str] = None
    created_at: datetime
    article_id: int

    class Config:
        from_attributes = True
