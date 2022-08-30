from database import db
from document import Document

from searchCount import SearchCount
from user import User
from keywordss import Keywordss
db.drop_all()
db.create_all()

document1 = Document(userID = 1, docName = "a new file", docLink = "www.google.com", category = "lending")
document2 = Document(userID = 1, docName = "another file", docLink = "www.google.com", category = "lending")
document3 = Document(userID = 1, docName = "a new testing file", docLink = "www.google.com", category = "lending")

keyword1 = Keywordss("lending")
keyword2 = Keywordss("document")
keyword3 = Keywordss("checklist")

document1.keywords.append(keyword1)
document1.keywords.append(keyword3)
document2.keywords.append(keyword2)
document3.keywords.append(keyword3)

search1 = SearchCount(searchText = "How do I lend", count=30)
search2 = SearchCount(searchText = "where is my lending document", count=2)
search3 = SearchCount(searchText = "what is lending", count=60)

db.session.add_all([document1, document2, document3])
db.session.add_all([keyword1, keyword2, keyword3])
db.session.add_all([search1, search2, search3])
db.session.commit()