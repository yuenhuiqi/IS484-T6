from database import *

import uuid
from datetime import datetime

from sqlalchemy import Enum
from flask import Flask, render_template, request, send_file, flash, jsonify

class Versioning(db.Model):
    __tablename__ = 'versioning'

    userID = db.Column(db.String(200), nullable=False)
    docID = db.Column(db.String(200), nullable=False, primary_key=True)
    docName = db.Column(db.String(200), nullable=False)
    docTitle = db.Column(db.String(200), nullable=False)
    docLink = db.Column(db.String(200))
    docType = db.Column(db.String(200), nullable=False)
    journey = db.Column(db.String(200), nullable=False)
    lastUpdated = db.Column(db.DATETIME, nullable=False)
    upload_status = db.Column(db.String(200), nullable=False, default="PENDING")
    
    
    def __init__(self, userID, docID, docName, docTitle, docLink, docType, journey, lastUpdated, upload_status):
        self.userID = userID
        self.docID = docID
        self.docName = docName
        self.docTitle = docTitle
        self.docLink = docLink
        self.docType = docType
        self.journey = journey
        self.lastUpdated = lastUpdated
        self.upload_status = upload_status