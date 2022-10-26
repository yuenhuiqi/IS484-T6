from database import *


class Feedback(db.Model):
    tablename = 'feedback'

    fSearchID = db.Column(db.Integer, primary_key=True)
    fDocID = db.Column(db.Integer, primary_key=True)
    count = db.Column(db.Integer, nullable=False)  # no of user clicks on document
    merit = db.Column(db.Integer, nullable=False)  # feedback
    demerit = db.Column(db.Integer, nullable=False)

    def init(self, searchID, docID, count):
        self.fSearchID = searchID
        self.fDocID = docID
        self.count = count
        self.merit = 0
        self.demerit = 0

    def json(self):
        return {
            "searchID": self.fSearchID,
            "docID": self.fDocID,
            "count": self.count,
            "merit": self.merit,
            "demerit": self.demerit
        }




def add_count(fSearchID, fDocID):

    if db.session.query(exists().where(Feedback.fSearchID == fSearchID and Feedback.fDocID == fDocID)).scalar():
        print(fDocID, fSearchID, "docSearch exist")
        
        try:
            currentQuery = Feedback.query.filter_by(fSearchID == fSearchID and fDocID == fDocID).first()
            currentQuery.count += 1
            db.session.commit()
            return 200, "DocSearch count updated"
        except Exception as e:
            print("Something Happened (Update DocSearch Query Count): ", e)
            return 400, e
        
    else:
        print(fDocID, fSearchID, "new query")
        newQuery = Feedback(fSearchID = fSearchID, fDocID = fDocID, count=1, merit = 0, demerit = 0)
        try: 
            db.session.add(newQuery)
            db.session.commit()
            return 200, "QueryCount added to DB!"

        except Exception as e:
            print("Something Happened (Add new DocSearch Query): ", e)
            return 400, e
        
def get_feedback_info(fSearchID, fDocID):

    try:
        info = Feedback.query.filter_by(fSearchID == fSearchID and fDocID == fDocID).first()

        return 200, info.json()
    except Exception as e:
        print("Something Happened fetching info: ", e)
        return 400, e
        
    

def update_feedback(fSearchID, fDocID, feedback):
    print(fSearchID, fDocID, feedback)
    try:
        current_score = Feedback.query.filter(Feedback.fSearchID == fSearchID and Feedback.fDocID == fDocID).first()
        print(current_score)
        if feedback > 0:
            current_score.merit += feedback
        else:
            current_score.demerit += feedback
        db.session.commit()
        return 200, "updated"
    except:
        return 400, "couldn't update"




