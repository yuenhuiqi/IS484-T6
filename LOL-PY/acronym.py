from database import *
from http import HTTPStatus
from searchCount import *

class Acronym(db.Model):
    __tablename__ = 'acronym'

    acronym = db.Column(db.String(200), nullable=False, primary_key=True)
    meaning = db.Column(db.String(200), nullable=False)
    


def getAllAcronyms(str_test):
    acronym_list = str_test.rstrip().split(",")

    for acronym in acronym_list:
        acronym_meaning = acronym.split(' | ')
        # print(acronym_meaning)

        try:
            acronym_list = Acronym(acronym=acronym_meaning[0], meaning=acronym_meaning[1])
            if acronym_list not in db:

                db.session.add(acronym_list)
                db.session.commit()

            print('````````````````````````````````')
            acronym_dict = {}
            acronym_dict[acronym_meaning[0]] = acronym_meaning[1]

            return acronym_dict

        except Exception as e:
            # upload.upload_status = UploadStatus.ERROR
            # acronym_list.upload_status = "ERROR"
            # db.session.commit()
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

