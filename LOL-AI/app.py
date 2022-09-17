from fastapi import FastAPI
from haystack_ai.nodes.CustomPDFToTextConverter import CustomPDFToTextConverter

app = FastAPI()



@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/test")
async def test():
    
    return {"message": CustomPDFToTextConverter("test", "test")}