from haystack import Pipeline
from haystack.nodes import DensePassageRetriever
from haystack.pipelines import DocumentSearchPipeline
from cupid_ai.nodes import retriever

# this will be improved eventually but for now, just serve a default DocumentSearchPipeline so the frontend has something to work with 
# searchPipeline = Pipeline()

retriever = retriever

searchPipeline = DocumentSearchPipeline(retriever=retriever)