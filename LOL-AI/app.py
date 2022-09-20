from fastapi import FastAPI
from haystack_ai.pipelines.uploaderPipeline import uploaderPipeline
from haystack.document_stores.faiss import FAISSDocumentStore

app = FastAPI()



@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/fakeupload")
async def test():
    meta = {
        "title": "test",
        "page": 1
    }
    uploaderPipeline.run(file_paths=["test"], meta=meta)
    return {"Message": "ok"}

@app.get("/createdocumentstore")
def createDocumentStore():
    documentstore = FAISSDocumentStore(
    sql_url="sqlite:///haystack_ai/db/faiss_meta.db", 
    progress_bar=False
    )
    documentstore.save("./haystack_ai/db/index.faiss")