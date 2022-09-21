from database import *

from datetime import datetime
from http import HTTPStatus

from flask import Flask, render_template, request, send_file, flash, jsonify


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
    