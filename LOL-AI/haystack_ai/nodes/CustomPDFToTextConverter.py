from PyPDF2 import PdfFileReader
from haystack_ai.model.InProgressDoc import InProgressDoc
from pathlib import Path
from typing import List

def CustomPDFToTextConverter(s3_link: str, title: str) -> dict:
    '''
    Converts PDF file into documents, applying basic preprocessing 
    
    Parameters:
    s3_link (str): AWS S3 link to 
    output: 
    '''

    # FOR TESTING PURPOSES - use Lending Journey User Guide in ./testdata -----------
    pages: List[str] = []
    with open("./haystack_ai/testdata/Lending Journey User Guide.pdf", "rb") as f:
        reader = PdfFileReader(f)
        num_pages = reader.getNumPages() 

        for i in range(num_pages):
            page = reader.pages[i]
            text = page.extract_text()
            pages.append(text)

    # END TESTING PORTION -----------------------------------------------------------
    # TODO - for the actual product we should extract a list of page text each pdf (method tbd) by this point, then continue from here
    # https://www.sqlservercentral.com/articles/reading-a-specific-file-from-an-s3-bucket-using-python - this is a good start 
    
    docs: List[dict] = []
    for i, page in enumerate(pages):
        in_progress_doc = InProgressDoc(title, i+1, page, page.splitlines())
        docs.append(
          in_progress_doc
          .remove_page_numbers()
          .remove_non_alpha()
          .join_sentences()
          .segment_words()
          .build()
          )
    
    return docs
