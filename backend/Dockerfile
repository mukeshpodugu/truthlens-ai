FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for build packages and PostgreSQL client
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Download NLTK data for NLP processing
RUN python -m nltk.downloader punkt stopwords wordnet omw-1.4

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
