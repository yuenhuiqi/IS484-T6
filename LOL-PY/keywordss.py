from database import *
# from document import Document

# doc_kw = db.Table('doc_kw',
#                     db.Column('docID', db.Integer, db.ForeignKey('document.docID')),
#                     db.Column('keywordID', db.Integer, db.ForeignKey('keywordss.keywordID'))
#                     )

class Keywordss(db.Model):
    __tablename__ = 'keywordss'

    keywordID = db.Column(db.Integer, primary_key=True)
    keywords = db.Column(db.String(30), nullable = False)
    


    def __init__(self, keywords):
        self.keywords = keywords