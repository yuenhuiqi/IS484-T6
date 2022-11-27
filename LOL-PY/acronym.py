from database import *
from http import HTTPStatus
from searchCount import *

class Acronym(db.Model):
    __tablename__ = 'acronym'

    acronym = db.Column(db.String(200), nullable=False, primary_key=True)
    meaning = db.Column(db.String(200), nullable=False)
    

def getAllAcronyms(str_test):
    acronym_list = str_test.rstrip().split(",")

    for acronyms in acronym_list:
        acronym_meaning = acronyms.lstrip().split(' | ')

        try:
            acronym_db = Acronym(acronym=acronym_meaning[0], meaning=acronym_meaning[1])
            exists = db.session.query(db.exists().where(Acronym.acronym == acronym_meaning[0])).scalar()

            if not exists:
                db.session.add(acronym_db)
                db.session.commit()

        except Exception as e:
            db.session.commit()
            return str(e), HTTPStatus.INTERNAL_SERVER_ERROR
