# TruthLens AI - Intelligent Fake News Detection Platform

TruthLens AI is a production-grade media intelligence and fact-checking platform. It leverages NLP, traditional machine learning models, and Deep Learning/Transformer embeddings to classify news credibility, identify sensationalist bias, perform sentiment/emotion parsing, and render interactive Explainable AI (XAI) attention maps.

Developed by: **PODUGU MUKESH**  
Email: [mukeshpodugu123@gmail.com](mailto:mukeshpodugu123@gmail.com)  
Phone: +91 8143999463  
Location: Srikakulam, AP, India  

---

## Live Deploys

* **Frontend Web Client (Vercel):** [https://truthlens-ai-rouge.vercel.app](https://truthlens-ai-rouge.vercel.app)
* **Backend Core API (Render):** [https://truthlens-ai-a68q.onrender.com](https://truthlens-ai-a68q.onrender.com)
* **API Documentation (Swagger UI):** [https://truthlens-ai-a68q.onrender.com/docs](https://truthlens-ai-a68q.onrender.com/docs)

---

## Key Features

1. **Intelligent News Auditing:** paste article text, upload documents, or check source URLs to identify: *Real News, Fake News, Misleading Content, Partially True, or Satire*.
2. **Dynamic Credibility Scoring:** rates articles from `0` to `100` based on language readability indices (Flesch readability ease), source domain trust lists, sentiment extremities, and classifier probabilities.
3. **Advanced NLP Preprocessing Pipeline:** cleans text, tokenizes, removes stopwords, lemmatizes words, parses Named Entities (Locations, Organizations, Persons), and extracts topic keyword distributions.
4. **Sentiment & Emotion Analysis:** outputs general positive/negative/neutral polarities along with a multi-class emotion breakdown (Joy, Anger, Fear, Sadness, Surprise, Disgust).
5. **Explainable AI (XAI) Heatmaps:** maps sentence-level attention weights and token-level LIME/SHAP contributions to highlight clickbait modifiers or logical gaps.
6. **Report Export Console:** stream and download publication-ready PDF reports and detailed Excel sheets containing all analysis parameters.
7. **Comprehensive Analytics Dashboard:** tracks total analyzed counts, monthly misinformation trends, category distributions, and model validation benchmarks.

---

## Technology Stack

* **Backend:** Python, FastAPI, SQLAlchemy, Uvicorn, NLTK, Scikit-Learn, Pandas, Transformers, PyTorch, FPDF2, OpenPyXL.
* **Frontend:** React, Next.js, Tailwind CSS, Recharts, Lucide Icons.
* **Infrastructure:** Docker, Docker Compose, Redis Caching, PostgreSQL.

---

## Folder Structure

```
truthlens-ai/
├── backend/
│   ├── app/
│   │   ├── api/          # Auth, news detector, analytics, and reports APIs
│   │   ├── core/         # Config loader, database session, security, Redis
│   │   ├── models/       # SQLAlchemy tables and Pydantic schemas
│   │   ├── services/     # NLP pipelines, sentiment, XAI, credibility
│   │   └── main.py       # FastAPI Entrypoint
│   ├── datasets/         # Raw, processed, and trained ML models
│   ├── scripts/          # Dataset downloader, model trainer, pipeline test
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Layout structures
│   │   ├── pages/        # Next.js Pages (Home, Dashboard, Detector, About)
│   │   ├── styles/       # Tailwind globals
│   │   └── utils/        # Axios API client
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── README.md
└── DOCUMENTATION.md
```

---

## Installation & Deployment Guide

### Option 1: Quickstart via Docker Compose (Recommended)

1. Clone or download the repository.
2. Spin up all containerized services (FastAPI, Next.js, PostgreSQL, Redis):
   ```bash
   docker-compose up --build
   ```
3. Once running, access the services:
   * **Web Client Frontend:** `http://localhost:3000`
   * **FastAPI Swagger Docs:** `http://localhost:8000/docs`

---

### Option 2: Local Manual Setup

#### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate # Windows
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Download raw datasets and train the classifiers:
   ```bash
   python scripts/download_datasets.py
   python scripts/train.py
   ```
5. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Access `http://localhost:3000` in your browser.

---

## Automated Test Verification

To run unit tests validating NLP parsing, security tokens, credibility scoring, and explainability maps:
```bash
python backend/scripts/test_pipeline.py
```
All assertions should return `PASSED` status under 500ms.
