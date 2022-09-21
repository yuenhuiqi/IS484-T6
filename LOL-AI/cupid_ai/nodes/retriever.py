from haystack.nodes import EmbeddingRetriever
from cupid_ai.nodes.document_store import documentstore


retriever = EmbeddingRetriever(
        document_store=documentstore,
        embedding_model="sentence-transformers/multi-qa-mpnet-base-dot-v1",
        model_format="sentence_transformers",
    )