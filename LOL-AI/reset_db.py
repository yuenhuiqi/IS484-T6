import os
from haystack.document_stores.faiss import FAISSDocumentStore


print("RESETTING DB FOLDER")
dir = "./cupid_ai/db"
# clear directory 
if os.path.isdir(dir):
    print("Found db folder, deleting existing files")
    for f in os.listdir(dir):
        if f != ".gitignore":
            os.remove(os.path.join(dir,f))

    # create new set of FAISS + SQL db
    print("Initializing new database")
    
    # we will eventually require a more robust SQL storage solution. But for now sqlite is fine. 
    documentstore = FAISSDocumentStore(
        sql_url="sqlite:///cupid_ai/db/faiss_meta.db", 
        progress_bar=False
        )
    documentstore.save("./cupid_ai/db/index.faiss")
    print("Done!")

else:
    print("db folder not found")