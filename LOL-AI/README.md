# Setup
Install packages 

    python -m venv env
    env\scripts\activate        # (for windows)
    pip install -r requirements-dev.txt

- TODO - Investigate whether faiss-gpu is required for faster inference. My understanding is that GPU is mainly useful for generating embeddings and not so much for inference tasks. 
    - If so, create requirements-prod.txt with faiss-gpu as dependency instead 

Running the application in development mode: 

    uvicorn main:app --reload

# About 
This app uses FastAPI as a web server. [Documentation](https://fastapi.tiangolo.com)

# Deployment and running in prod 
TBD 