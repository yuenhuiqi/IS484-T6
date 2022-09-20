from database import db
from document import Document
from versioning import Versioning

from searchCount import SearchCount
from user import User
from keywordss import Keywordss
db.drop_all()
db.create_all()

search1 = SearchCount(searchText = "How do I lend", count=30)
search2 = SearchCount(searchText = "where is my lending document", count=2)
search3 = SearchCount(searchText = "what is lending", count=60)

user1 = User(userID = "lolre", userName = "Reader", role = "reader")
user2 = User(userID = "lolup1", userName = "Uploader 1", role = "uploader")
user3 = User(userID = "lolup2", userName = "Uploader 2", role = "uploader")

db.session.add_all([search1, search2, search3])
db.session.add_all([user1, user2, user3])
db.session.commit()