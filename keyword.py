from database import *


class Keyword(db.Model):
    __tablename__ = 'keywords'

    keywordID = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(30), nullable = False)


    def __init__(self, keyword):
        self.keyword = keyword