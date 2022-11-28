from database import db
from document import Document
from versioning import Versioning

from searchCount import SearchCount
from user import User
from acronym import Acronym
from feedback import Feedback
db.drop_all()
db.create_all()

search1 = SearchCount(searchText = "how do I lend", count=30, merit =0, demerit=0)
search2 = SearchCount(searchText = "where is my lending document", count=2, merit =0, demerit=0)
search3 = SearchCount(searchText = "what is lending", count=60, merit =0, demerit=0)
search4 = SearchCount(searchText = "what do i need for credit application", count=88, merit =0, demerit=0)
search5 = SearchCount(searchText = "clm management roles", count=5, merit =0, demerit=0)
search6 = SearchCount(searchText = "how to edit attributes of credit document", count=43, merit =0, demerit=0)

user1 = User(userID = "lolre", userName = "Reader", role = "reader")
user2 = User(userID = "lolup1", userName = "Uploader 1", role = "uploader")
user3 = User(userID = "lolup2", userName = "Uploader 2", role = "uploader")

db.session.add_all([search1, search2, search3, search4, search5, search6])
db.session.add_all([user1, user2, user3])
db.session.commit()