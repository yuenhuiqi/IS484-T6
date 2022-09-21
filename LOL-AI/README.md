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
Set ENV to PROD

TBD