from database import *
from flask import jsonify


class Feedback(db.Model):
    __tablename__ = 'feedback'

    fID = db.Column(db.Integer, primary_key=True)
    fSearchID = db.Column(db.String(200), nullable=False)
    fDocID = db.Column(db.String(200), nullable=False)
    count = db.Column(db.Integer, nullable=False)  # no of user clicks on document
    merit = db.Column(db.Integer, nullable=False)  # feedback
    demerit = db.Column(db.Integer, nullable=False)

    def init(self, fSearchID, fDocID, count):
        self.fSearchID = fSearchID
        self.fDocID = fDocID
        self.count = count 
        self.merit = 0
        self.demerit = 0

    def json(self):
        return {
            "fID": self.fID,
            "fSearchID": self.fSearchID,
            "fDocID": self.fDocID,
            "count": self.count,
            "merit": self.merit,
            "demerit": self.demerit
        }


def add_querydoc_count(searchID, docID):
    search_ID = '{0}'.format(searchID)
    doc_ID = '{0}'.format(docID)

    if db.session.query(exists().where(Feedback.fSearchID == search_ID)).scalar() and db.session.query(exists().where(Feedback.fDocID == doc_ID)).scalar():
        print(search_ID, doc_ID, "feedback exist")
        currentFeedback = Feedback.query.filter_by(fSearchID=search_ID, fDocID=doc_ID).first()
        currentFeedback.count += 1
        try:
            db.session.commit()
            return 200, "feedback count updated"
        except Exception as e:
            print("Something Happened (Update DocSearch Query Count): ", e)
            return 400, e
        
    else:
        print(search_ID, doc_ID, "new feedback")
        newFeedback = Feedback(fSearchID = search_ID, fDocID = doc_ID, count=1, merit = 0, demerit = 0)
        try: 
            db.session.add(newFeedback)
            db.session.commit()
            return 200, "Feedback added to DB!"

        except Exception as e:
            print("Something Happened (Add new DocSearch Query): ", e)
            return 400, e
        

def update_feedback(searchID, docID, score):
    # print(searchID, docID, score)

    score = int(score)

    try:
        currentFeedback = Feedback.query.filter_by(fSearchID=searchID, fDocID=docID).first()

        print(currentFeedback.fDocID)
        if (score > 0):
            currentFeedback.merit += 1
            print(currentFeedback.merit, "after commit")

        else:
            currentFeedback.demerit += 1
            print(currentFeedback.demerit, "after commit")
            

        db.session.commit()

        return 200, "Feedback updated"

    except Exception as e:
        print("Something Happened (Update Feedback Count): ", e)
        return 400, e









