from database import *
from http import HTTPStatus
from searchCount import *

class Acronym(db.Model):
    __tablename__ = 'acronym'

    acronym = db.Column(db.String(200), nullable=False, primary_key=True)
    meaning = db.Column(db.String(200), nullable=False)
    


def getAllAcronyms(str_test):
    acronym_list = str_test.rstrip().split(",")
    # print(acronym_list)

    for acronyms in acronym_list:
        # print(acronyms)
        acronym_meaning = acronyms.lstrip().split(' | ')
        # print(acronym_meaning)

        try:
            acronym_db = Acronym(acronym=acronym_meaning[0], meaning=acronym_meaning[1])
            exists = db.session.query(db.exists().where(Acronym.acronym == acronym_meaning[0])).scalar()
            # print(exists)
            if not exists:
                print("new acronym added")
                db.session.add(acronym_db)
                db.session.commit()

            # print('````````````````````````````````')
            # acronym_dict = {}
            # acronym_dict[acronym_meaning[0]] = acronym_meaning[1]

            # return acronym_dict

        except Exception as e:
            # db.session.rollback()
            # acronym_list.upload_status = "ERROR"
            db.session.commit()
            return str(e), HTTPStatus.INTERNAL_SERVER_ERROR


# def getAcronymMeaning(qn, acronyms):
#     print(qn)
#     print(acronyms)

#     try:
#         looking_for = '%{0}%'.format(qn)
#         acronyms = SearchCount.query.filter(Acronym.acronym.ilike(
#             looking_for)).all()
#         print(acronyms)

#         return 200, [acronym.json() for acronym in acronyms]
#     except:
#         print("none found")

