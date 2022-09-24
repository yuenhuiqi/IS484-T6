from haystack.nodes import EmbeddingRetriever
from haystack.nodes import DensePassageRetriever
from cupid_ai.nodes.document_store import documentstore
from config import settings

use_gpu = settings.use_gpu

retriever = EmbeddingRetriever(
        document_store=documentstore,
        embedding_model="sentence-transformers/multi-qa-mpnet-base-dot-v1",
        model_format="sentence_transformers",
        use_gpu=use_gpu
    )

# retriever = DensePassageRetriever(
#     document_store=documentstore,
#     use_gpu=use_gpu
#     )