from haystack.pipelines import Pipeline

from cupid_ai.nodes import CustomPDFToTextConverter
from haystack.nodes import PreProcessor
from cupid_ai.nodes.document_store import documentstore

text_converter = CustomPDFToTextConverter()

preprocessor = PreProcessor(
    clean_empty_lines=True,
    clean_whitespace=True,
    clean_header_footer=True,
    split_by="word",
    split_length=100,
    split_respect_sentence_boundary=False,
)

uploaderPipeline = Pipeline()

# TODO - use custom pdf converter node and preprocessor, get it into document store 
uploaderPipeline.add_node(component=text_converter, name="customPDFToTextConverter", inputs=["File"])  # NOTE - this is bastardized a bit, input is an S3 link and not an actual file path. 
uploaderPipeline.add_node(component=preprocessor, name="Preprocessor", inputs=["customPDFToTextConverter"])
uploaderPipeline.add_node(component=documentstore, name="FAISSDocumentStore", inputs=["Preprocessor"])