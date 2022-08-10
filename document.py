from database import *
from keyword import Keyword

doc_kw = db.Table('doc_kw',
                    db.Column('docID', db.Integer, db.ForeignKey('document.docID')),
                    db.Column('keywordID', db.Integer, db.ForeignKey('keyword.keywordID'))
                    )


class Document(db.Model):
    __tablename__ = 'documents'
    userID = db.Column(db.Integer, nullable=False)
    docID = db.Column(db.String(30), nullable=False, primary_key=True)
    docName = db.Column(db.String(30), nullable=False)
    docLink = db.Column(db.String(30), nullable=False)
    category = db.Column(db.String(30), nullable=False)
    lastUpdated = db.Column(db.String(30), nullable=False)
    keywords = db.relationship('Keyword', secondary=doc_kw)
    
    def __init__(self, userID, docName, docLink, category, lastUpdated):
        self.userID = userID
        self.docName = docName
        self.docLink = docLink
        self.category = category
        self.lastUpdated = lastUpdated





def write_functions_here():
    print( "meeps")
    