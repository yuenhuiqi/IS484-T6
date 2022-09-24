# Setup
Install packages 

    python -m venv env
    env\scripts\activate        # (for windows)
    pip install -r requirements-dev.txt

- TODO - Investigate whether faiss-gpu is required for faster inference. My understanding is that GPU is mainly useful for generating embeddings and not so much for inference tasks. 
    - If so, create requirements-prod.txt with faiss-gpu as dependency instead 
b

Running the application in development mode: 

    uvicorn app:app --reload 


If it's your first time running this server in a new environment, or you've messed up something and want to reset, run the reset script to clear the db folder and create an empty DocumentStore.
    
    python reset_db.py


The **API documentation** can be seen at http://localhost:8000/docs - this is a set of built-in Swagger documentation which also allows you to easily send requests to the server. 

# About 
This app uses FastAPI as a web server. [Documentation](https://fastapi.tiangolo.com)

# Deployment and running in prod 
Set ENV to PROD (not necessary as of now)

Run server:

    uvicorn app:app --host 0.0.0.0 --port 80

## Improvements 
Deployment concepts here - explore if there is time https://fastapi.tiangolo.com/deployment/manually/#deployment-concepts
https://fastapi.tiangolo.com/deployment/concepts/ 


In particular, see the improvements relating to [server workers](https://fastapi.tiangolo.com/deployment/server-workers/) - this might allow the app to continue serving search requests even while generating embeddings for an uploaded document. 