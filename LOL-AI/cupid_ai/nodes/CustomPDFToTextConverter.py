import io
from PyPDF2 import PdfFileReader
from haystack.nodes import BaseConverter
from haystack import Document
from cupid_ai.model import InProgressDoc
from cupid_ai.util import s3, bucket_name
from typing import Any, Dict, List, Optional


class CustomPDFToTextConverter(BaseConverter):
    
    def convert(
            self,
            file_path: str,
            meta: Optional[Dict[str, Any]],
            remove_numeric_tables: Optional[bool] = None,
            valid_languages: Optional[List[str]] = None,
            encoding: Optional[str] = "UTF-8",
            id_hash_keys: Optional[List[str]] = None) -> List[Document]:
            
        '''
        Converts PDF file into documents, applying basic preprocessing 
        
        Parameters:
        file_path (str): AWS S3 key of the input document
        meta(Optional[Dict[str, Any]]): {
            ID (str): UUID of file as it is recorded in the web app database
        }
        output: 
        '''

        # FOR TESTING PURPOSES - use Lending Journey User Guide in ./testdata -----------
        # with open("./cupid_ai/testdata/Lending Journey User Guide.pdf", "rb") as f:
        #     reader = PdfFileReader(f)
        #     num_pages = reader.getNumPages() 

        #     for i in range(num_pages):
        #         page = reader.pages[i]
        #         text = page.extract_text()
        #         pages.append(text)

        # END TESTING PORTION -----------------------------------------------------------
        # TODO - for the actual product we should extract a list of page text each pdf (method tbd) by this point, then continue from here
        # https://www.sqlservercentral.com/articles/reading-a-specific-file-from-an-s3-bucket-using-python - this is a good start 

        pages: List[str] = []
        
        object = s3.Object(bucket_name, file_path).get()["Body"].read()
        with io.BytesIO(object) as f:
            reader = PdfFileReader(f)
            for page in reader.pages:
                pages.append(page.extract_text())
        
        docs: List[InProgressDoc] = []
        for i, page in enumerate(pages):
            in_progress_doc = InProgressDoc(meta["doc_uuid"], i+1, page, page.splitlines())
            docs.append(
            in_progress_doc
            .remove_page_numbers()
            .remove_non_alpha()
            .join_sentences()
            .segment_words()
            )


        output_docs: List[Document] = []
        for doc in docs:
            if len(doc.lines) > 0 and len(doc.lines[0]) > 0:
                output_docs.append(doc.build())
        # return list of Documents after checking that content of inprogressdoc is not empty 
        return output_docs