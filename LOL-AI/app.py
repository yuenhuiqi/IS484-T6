from urllib import response
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from cupid_ai.handler.SearchRequestHandler import SearchRequestHandler
from cupid_ai.nodes import documentstore
from cupid_ai.pipelines import uploaderPipeline
from cupid_ai.nodes import retriever
# from cupid_ai.pipelines import uploaderManualPipeline
from cupid_ai.model.UploadRequest import UploadRequest
from cupid_ai.model import SearchRequest
from config import settings
from haystack.document_stores.faiss import FAISSDocumentStore

app = FastAPI()

origins = [
    "http://localhost:4200",
    "https://54.254.54.186:2222/",
    "https://18.142.140.202:2222",
    "https://18.142.140.202"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    
    documentstore = FAISSDocumentStore(
        sql_url="sqlite:///cupid_ai/db/faiss_meta.db", 
        progress_bar=False
    )
    
    print(documentstore)
    
    
    return {"message": "Hello World"}

@app.post("/upload", status_code=201)
async def upload(uploadRequest: UploadRequest, response: Response):
    '''
       Upload documents to the server for indexing.
       Request body items: 
            item_s3_key (str): AWS s3 key of the target document 
            doc_uuid (str): UUID of document in the web app database
    '''

    meta = {
        "doc_uuid": uploadRequest.doc_uuid
    }

    # todo - implement better error checking and response codes 
    uploaderPipeline.run(file_paths=[uploadRequest.item_s3_key], meta=meta)
    documentstore.update_embeddings(retriever)
    documentstore.save(settings.faiss_index_path)
    return {"response": "SUCCESS"}


@app.post("/search")
def search(searchrequest: SearchRequest):
    handler = SearchRequestHandler(searchrequest.query)
    return handler.run()
