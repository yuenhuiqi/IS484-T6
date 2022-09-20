from database import *
from keywordss import Keywordss
from user import getUserByID
from versioning import moveDocToVersioning, deleteDocVersions

import uuid
from datetime import datetime
from io import BytesIO
from base64 import b64decode
from collections import deque
from http import HTTPStatus
import boto3

import enum
from sqlalchemy import Enum
from flask import Flask, render_template, request, send_file, flash, jsonify


# class UploadStatus(enum.Enum):
#     """
#     Serves as enum values for upload_status column of files table
#     (either PENDING, PROCESSING, COMPLETE OR ERROR)
#     """
#     PENDING = 1
#     PROCESSING = 2
#     COMPLETE = 3
#     ERROR = 4


# doc_kw = db.Table('doc_kw',
#                     db.Column('dk_docID', db.Integer, db.ForeignKey('document.docID')),
#                     db.Column('dk_keywordID', db.Integer, db.ForeignKey('keywordss.keywordID'))
#                     )


class Document(db.Model):
    __tablename__ = 'document'

    userID = db.Column(db.String(200), nullable=False)
    docID = db.Column(db.String(200), nullable=False, primary_key=True)
    docName = db.Column(db.String(200), nullable=False)
    docTitle = db.Column(db.String(200), nullable=False)
    docLink = db.Column(db.String(200))
    VersionID = db.Column(db.String(200))
    docType = db.Column(db.String(200), nullable=False)
    journey = db.Column(db.String(200), nullable=False)
    lastUpdated = db.Column(db.DATETIME, nullable=False)
    # upload_status = db.Column(
    #     Enum(UploadStatus), nullable=False, default=UploadStatus.PENDING
    # )
    upload_status = db.Column(
        db.String(200), nullable=False, default="PENDING")

    # keywords = db.relationship('Keywordss', secondary=doc_kw, backref = 'documents')

    # def __init__(self, userID, docName, docTitle, docLink, docType, journey, upload_status):
    #     self.userID = userID
    #     self.docName = docName
    #     self.docTitle = docTitle
    #     self.docLink = docLink
    #     self.docType = docType
    #     self.journey = journey
    #     now = datetime.now()
    #     self.lastUpdated = now.strftime("%d/%m/%Y %H:%M:%S")


app.config['AWS_ACCESS_KEY'] = "AKIATQNEAAZWJVRPYX56"
app.config['AWS_SECRET_ACCESS_KEY'] = '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'
app.config['AWS_BUCKET_NAME'] = 'is484t6'
app.config['AWS_DOMAIN'] = 'http://is484t6.us-east-1.s3.amazonaws.com/'


session = boto3.Session(
    aws_access_key_id=app.config["AWS_ACCESS_KEY"],
    aws_secret_access_key=app.config["AWS_SECRET_ACCESS_KEY"]
)

s3 = session.client('s3')
s3_resource = session.resource('s3')

# s3 = boto3.client(
#     "s3",
#     aws_access_key_id=app.config["AWS_ACCESS_KEY"],
#     aws_secret_access_key=app.config["AWS_SECRET_ACCESS_KEY"],
# )

# s3_resource = boto3.resource('s3')
s3_bucket = s3_resource.Bucket(app.config["AWS_BUCKET_NAME"])

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'ppt', 'pptx', 'doc', 'docx'}


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_doc_to_s3(doc, fn):
    # Document pre-processing
    file = doc['file'].split(",")
    data = BytesIO(b64decode(file[1]))

    ct = file[0].split(";")[0]
    ct = ct.split(":").pop()
    # print(ct)

    # Upload Document to S3
    try:
        s3.upload_fileobj(
            data,
            app.config["AWS_BUCKET_NAME"],
            fn,
            ExtraArgs={
                "ContentType": ct  # Set appropriate content type as per the file
                # "ContentType": ct.content_type
            }
        )
    except Exception as e:
        print("Something Happened (S3 Upload): ", e)
        return "Err", e

    # Retrieve VersionID of uploaded document
    try:
        versions = s3_bucket.object_versions.filter(Prefix=fn)
        s3_object_versions = deque()
        for version in versions:
            obj = version.get()
            s3_object_versions.append(obj.get('VersionId'))
        # print(s3_object_versions, 'All versionID')
        # print(s3_object_versions[0], 'versionID')

    except Exception as e:
        print("Something Happened (S3 Versioning): ", e)
        return "Err", e

    return ["{}{}".format(app.config["AWS_DOMAIN"], fn), s3_object_versions[0]]


def upload_doc(name, doc, doctype):
    id = uuid.uuid1()
    id = id.hex
    dt = str(datetime.now())

    try:
        upload = Document(userID=doc['userID'], docID=id, docName=name, docTitle=doc['title'], docType=doctype, journey=doc['journey'],
                          lastUpdated=dt, upload_status="PROCESSING")
        db.session.add(upload)
        db.session.commit()

        print('````````````````````````````````')

        docS3 = upload_doc_to_s3(doc, name)
        if docS3[0] == "Err":
            Document.query.filter_by(docID=id).delete()
            db.session.commit()
            return 'Err', docS3[1]
        else:
            upload.docLink = docS3[0]
            upload.VersionID = docS3[1]
            upload.upload_status = "COMPLETE"
            # upload.upload_status = UploadStatus.COMPLETE
            db.session.commit()

            print(f'Uploaded: {name, id, dt}')
            return f'Uploaded: {name, id, dt}', HTTPStatus.OK

    except Exception as e:
        # upload.upload_status = UploadStatus.ERROR
        upload.upload_status = "ERROR"
        db.session.commit()
        return str(e), HTTPStatus.INTERNAL_SERVER_ERROR


def upload_multiDocs(docs):
    print("--------")
    for name in docs:

        doc = docs[name]
        # print(doc)
        if doc and allowed_file(name):
            doctype = name.rsplit('.', 1)[1].lower()

            if db.session.query(exists().where(Document.docName == name)).scalar():
                print(name, "doc exist")
                currentDoc = Document.query.filter_by(docName=name).first()
                moveDocToVersioning(currentDoc)
                update_doc(currentDoc, doc, name)

            else:
                print(name, "new doc")
                upload = upload_doc(name, doc, doctype)
                if upload[0] == 'Err':
                    return f'Document upload error! {upload[1]}'
        else:
            # print('unknown file')
            return "File extension unknown, unable to download"

    return 'All documents uploaded!'


def update_doc(currentDoc, doc, name):
    dt = str(datetime.now())

    try:
        docS3 = upload_doc_to_s3(doc, name)
        if docS3[0] == "Err":
            return 'Update Failed!', docS3[1]
        else:
            update = currentDoc
            update.userID = doc['userID']
            update.docTitle = doc['title']
            update.journey = doc['journey']
            update.lastUpdated = dt
            update.docLink = docS3[0]
            update.VersionID = docS3[1]
            db.session.commit()

            print(f'Updated: {name, dt}')
            return f'Updated: {name, dt}', HTTPStatus.OK

    except Exception as e:
        update.upload_status = "UPDATE ERROR"
        db.session.commit()
        return str(e), HTTPStatus.INTERNAL_SERVER_ERROR


def dl(upload_id):
    upload = Document.query.filter_by(docID=upload_id).first()
    print(f'{upload.filename} downloaded!')
    return send_file(BytesIO(upload.data), attachment_filename=upload.filename, as_attachment=True)


def getAllDocs(docs):
    docList = []
    for doc in docs:
        uploaderName = getUserByID(doc.userID)
        status = doc.upload_status
        docList.append({'uploaderName': uploaderName, 'docID': doc.docID, 'docName': doc.docName, 'docTitle': doc.docTitle,
                        'docType': doc.docType, 'journey': doc.journey, 'docLink': doc.docLink, 'VersionID': doc.VersionID, 'lastUpdated': doc.lastUpdated, 'upload_status': status})

    return jsonify(docList)


def deleteAllDocVersions(docName):
    # Delete ALL Document Versions from AWS S3 bucket
    s3_bucket.object_versions.filter(Prefix=docName).delete()
    print(f'All versions of {docName} has been deleted from S3!')

    # Delete from Document DB
    Document.query.filter_by(docName=docName).delete()

    # Delete all past versions from Version DB
    deleteDocVersions(docName)
    db.session.commit()

    print(f'{docName} deleted from Document & Version DB!')
    return f'{docName} deleted!'
