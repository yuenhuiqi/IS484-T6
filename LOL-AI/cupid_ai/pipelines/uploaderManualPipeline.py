# there seems to be some problem with using FAISSDocuemntStore in the indexing pipeline, related to https://github.com/deepset-ai/haystack/issues/1903
# or possibly https://github.com/deepset-ai/haystack/issues/1411#issuecomment-916792041 
# Looks like the document is not being written properly to the FAISS index file, resulting in the embeddings being lost on server restart. 
# so this is the best approach for now 


from typing import Optional
from haystack.nodes.preprocessor import PreProcessor
from haystack.nodes import EmbeddingRetriever
from config import settings
from cupid_ai.nodes import CustomPDFToTextConverter
from cupid_ai.nodes.document_store import documentstore

def uploaderManualPipeline(url: str, meta: Optional[dict]):
    # get list of Documents 
    converter = CustomPDFToTextConverter()
    docs = converter.convert(file_path=url, meta = meta)

    preprocessor = PreProcessor(
    clean_empty_lines=True,
    clean_whitespace=True,
    clean_header_footer=True,
    split_by="word",
    split_length=100,
    split_respect_sentence_boundary=False,
)

    retriever = EmbeddingRetriever(
        document_store=documentstore,
        embedding_model="sentence-transformers/multi-qa-mpnet-base-dot-v1",
        model_format="sentence_transformers",
    )

    preprocessed_docs = preprocessor.process(docs)

    documentstore.write_documents(preprocessed_docs)
    documentstore.update_embeddings(retriever)
    documentstore.save(settings.faiss_index_path)
    