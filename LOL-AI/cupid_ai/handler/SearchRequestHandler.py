from re import search
from cupid_ai.pipelines import searchPipeline


class SearchRequestHandler:
    # This class exists just in case there is additional preprocessing of the query, or logic to be applied, 
    # that cannot be done within a pipeline. For now, just call the DocumentSearchPipeline
    # and for query classification (process/product questions) use a custom pipeline and Query Classifier node to filter

    def __init__(self, query):
        self.query = query
    
    def run(self):
        res = searchPipeline.run(
            self.query,
            params={
                "Retriever": {"top_k": 3},
                "Reader": {"top_k": 3}
            })
        print(res)
        return res