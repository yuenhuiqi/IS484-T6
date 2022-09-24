from haystack.document_stores.faiss import FAISSDocumentStore
from config import settings


# documentstore = FAISSDocumentStore(
#     faiss_index_path=settings.faiss_index_path,
#     faiss_config_path=settings.faiss_config_path
# )

documentstore = FAISSDocumentStore.load(
    settings.faiss_index_path,
    settings.faiss_config_path,
)