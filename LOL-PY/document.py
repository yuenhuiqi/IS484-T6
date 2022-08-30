from database import *
from keywordss import Keywordss
from datetime import datetime



doc_kw = db.Table('doc_kw',
                    db.Column('dk_docID', db.Integer, db.ForeignKey('document.docID')),
                    db.Column('dk_keywordID', db.Integer, db.ForeignKey('keywordss.keywordID'))
                    )


class Document(db.Model):
    __tablename__ = 'document'
    userID = db.Column(db.Integer, nullable=False)
    docID = db.Column(db.Integer, nullable=False, primary_key=True)
    docName = db.Column(db.String(30), nullable=False)
    docLink = db.Column(db.String(30), nullable=False)
    category = db.Column(db.String(30), nullable=False)
    lastUpdated = db.Column(db.String(30), nullable=False)
    keywords = db.relationship('Keywordss', secondary=doc_kw, backref = 'documents')
    
    def __init__(self, userID, docName, docLink, category):
        self.userID = userID
        self.docName = docName
        self.docLink = docLink
        self.category = category
        now = datetime.now()
        self.lastUpdated = now.strftime("%d/%m/%Y %H:%M:%S")





def write_functions_here():
    print( "meeps")
    