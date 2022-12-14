from database import *
from user import getUserByID

from http import HTTPStatus
from flask import jsonify


class Versioning(db.Model):
    __tablename__ = 'versioning'
    
    versionID = db.Column(db.String(200), primary_key=True)
    userID = db.Column(db.String(200), nullable=False)
    docID = db.Column(db.String(200), nullable=False)
    docName = db.Column(db.String(200), nullable=False)
    docTitle = db.Column(db.String(200), nullable=False)
    docLink = db.Column(db.String(200))
    docType = db.Column(db.String(200), nullable=False)
    journey = db.Column(db.String(200), nullable=False)
    lastUpdated = db.Column(db.DATETIME, nullable=False)

    def __init__(self, versionID, userID, docID, docName, docTitle, docLink, docType, journey, lastUpdated):
        self.versionID = versionID
        self.userID = userID
        self.docID = docID
        self.docName = docName
        self.docTitle = docTitle
        self.docLink = docLink
        self.docType = docType
        self.journey = journey
        self.lastUpdated = lastUpdated


def getVersionNo(doc_id):
    versionCount = Versioning.query.filter_by(docID=doc_id).count()
    return versionCount

def moveDocToVersioning(row):
    try:
        version = Versioning(versionID=row.VersionID, userID=row.userID, docID=row.docID, docName=row.docName, docTitle=row.docTitle, docLink = row.docLink, docType=row.docType, journey=row.journey,
                            lastUpdated=row.lastUpdated)
        db.session.add(version)
        db.session.commit()
    except Exception as e:
        return str(e), HTTPStatus.INTERNAL_SERVER_ERROR

def deleteDocVersions(docName):
    return Versioning.query.filter_by(docName=docName).delete()
    
def getAllVersions(doc_id):
    docs = Versioning.query.filter_by(docID=doc_id).order_by(Versioning.lastUpdated.desc())
    versionCount = getVersionNo(doc_id)
    docList = []
    for doc in docs:
        doc.docName = "{} v{}".format(doc.docName, versionCount)
        uploaderName = getUserByID(doc.userID)
        docList.append({'uploaderName': uploaderName, 'docID': doc.docID, 'docName': doc.docName, 'docLink': doc.docLink, 'VersionID': doc.versionID, 'lastUpdated': doc.lastUpdated})

        versionCount -= 1

    return jsonify(docList)