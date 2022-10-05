from haystack import Pipeline
from haystack.nodes import DensePassageRetriever
from haystack.pipelines import DocumentSearchPipeline, ExtractiveQAPipeline
from cupid_ai.nodes import retriever, reader

# this will be improved eventually but for now, just serve a default DocumentSearchPipeline so the frontend has something to work with 
# searchPipeline = Pipeline()

reader = reader
retriever = retriever

# searchPipeline = DocumentSearchPipeline(retriever=retriever)
searchPipeline = ExtractiveQAPipeline(reader, retriever)