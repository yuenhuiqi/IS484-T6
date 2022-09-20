from haystack.pipelines import Pipeline

from haystack_ai.nodes.CustomPDFToTextConverter import CustomPDFToTextConverter
from haystack.document_stores.faiss import FAISSDocumentStore
from haystack.nodes import PreProcessor

text_converter = CustomPDFToTextConverter()

preprocessor = PreProcessor(
    clean_empty_lines=True,
    clean_whitespace=True,
    clean_header_footer=True,
    split_by="word",
    split_length=100,
    split_respect_sentence_boundary=False,
)

documentstore = FAISSDocumentStore(
    sql_url="sqlite:///", 
    progress_bar=False
)
# initialize FAISS Document Store with default settings 
# Default SQL database for metdata uses an SQLite instance, which we accept for development and testing purposes.
# For deployment/handover, we should have an external SQL database (Haystack recommends Postgres) so that metadata is permanent even in the event of server shutdown. 

uploaderPipeline = Pipeline()

# TODO - use custom pdf converter node and preprocessor, get it into document store 
uploaderPipeline.add_node(component=text_converter, name="customPDFToTextConverter", inputs=["File"])  # NOTE - this is bastardized a bit, input is an S3 link and not an actual file path. 
uploaderPipeline.add_node(component=preprocessor, name="Preprocessor", inputs=["customPDFToTextConverter"])
uploaderPipeline.add_node(component=documentstore, name="FAISSDocumentStore", inputs=["Preprocessor"])