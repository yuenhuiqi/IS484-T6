from fastapi import FastAPI
from cupid_ai.nodes import documentstore
from cupid_ai.pipelines import uploaderPipeline
from cupid_ai.nodes import retriever
from cupid_ai.pipelines import uploaderManualPipeline
from config import settings

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/fakeupload")
async def test():
    '''
       Dummy upload function. 
       TODO - run this, close the server and attempt restart. If all ok, delete this line and commit/push
    '''
    meta = {
        "title": "test",
        "page": 1
    }
    uploaderPipeline.run(file_paths=["test"], meta=meta)
    documentstore.update_embeddings(retriever)
    documentstore.save(settings.faiss_index_path)

    # uploaderManualPipeline(url="fakeUrl", meta = meta)
    return {"Message": "ok"}
