from database import *
# from keywordss import Keywordss
from user import getUserByID
from versioning import moveDocToVersioning, deleteDocVersions

import uuid
from datetime import datetime
from io import BytesIO, TextIOWrapper, StringIO
from base64 import b64decode
from collections import deque
from http import HTTPStatus
import boto3
from botocore.exceptions import ClientError

import enum
from sqlalchemy import Enum
from flask import Flask, render_template, request, send_file, flash, jsonify
from acronym import *

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
    upload_status = db.Column(
        db.String(200), nullable=False, default="PENDING")


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
        
        if 'glossary.txt' == name.lower():
            file = doc['file'].split(",")
            data = BytesIO(b64decode(file[1]))
            text_wrapper = TextIOWrapper(data, encoding='utf-8')
            str_test = text_wrapper.read()
            getAllAcronyms(str_test)

        docS3 = upload_doc_to_s3(doc, name)
        if docS3[0] == "Err":
            Document.query.filter_by(docID=id).delete()
            db.session.commit()
            return 'Err', docS3[1]
        else:
            upload.docLink = docS3[0]
            upload.VersionID = docS3[1]
            upload.upload_status = "COMPLETE"
            db.session.commit()

            print(f'Uploaded: {name, id, dt}')
            return f'Uploaded: {name, id, dt}', HTTPStatus.OK

    except Exception as e:
        upload.upload_status = "ERROR"
        db.session.commit()
        return str(e), HTTPStatus.INTERNAL_SERVER_ERROR


def upload_multiDocs(docs):
    for name in docs:

        doc = docs[name]

        if doc and allowed_file(name):
            doctype = name.rsplit('.', 1)[1].lower()

            if db.session.query(exists().where(Document.docName == name)).scalar():
                # print(name, "doc exist")
                currentDoc = Document.query.filter_by(docName=name).first()
                moveDocToVersioning(currentDoc)
                update_doc(currentDoc, doc, name)

            else:
                # print(name, "new doc")
                upload = upload_doc(name, doc, doctype)
                if upload[0] == 'Err':
                    return f'Document upload error! {upload[1]}'
        else:
            return f"File extension of {name} not allowed, unable to download"

    return 'All documents uploaded!'


def update_doc(currentDoc, doc, name):
    dt = str(datetime.now())

    if 'glossary.txt' == name.lower():
        file = doc['file'].split(",")
        data = BytesIO(b64decode(file[1]))
        text_wrapper = TextIOWrapper(data, encoding='utf-8')
        str_test = text_wrapper.read()
        getAllAcronyms(str_test)

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

def update_docDetails(doc, doc_title, doc_journey):
    try:        
        doc.docTitle = doc_title
        doc.journey = doc_journey
        db.session.commit()

        return jsonify(
            {
                "code": 200,
                "message": "Document details has been successfully updated!"
            }
        )
    except:
        return jsonify(
            {
                "code": 500,
                "message": "Failed to update document details :("
            }
        )

def getAllDocs(docs, item_count):
    docList = []
    for doc in docs:
        uploaderName = getUserByID(doc.userID)
        status = doc.upload_status
        docList.append({'uploaderName': uploaderName, 'docID': doc.docID, 'docName': doc.docName, 'docTitle': doc.docTitle,
                        'docType': doc.docType, 'journey': doc.journey, 'docLink': doc.docLink, 'VersionID': doc.VersionID, 'lastUpdated': doc.lastUpdated, 'upload_status': status})

    return jsonify({'details': docList, 'itemCount': item_count})


def search_doc(title, page_size, page):  # crude search no algorithmic smoothening of suggestions yet (i.e., for each sentence in a word, suggest)
    if '{0}'.format(title) == "-":
        docs = Document.query.order_by(Document.lastUpdated.desc()).paginate(page=page, per_page=page_size)
        count = Document.query.count()

    else:
        try:
            looking_for = '%{0}%'.format(title)
            docs = Document.query.filter(Document.docTitle.ilike(
                looking_for)).order_by(Document.lastUpdated.desc()).paginate(page=page, per_page=page_size)
            count = Document.query.filter(Document.docTitle.ilike(looking_for)).count()

        except:
            return 404, "Document does not exist"

    return getAllDocs(docs.items, int(count))


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


def getPresignedUrl(file_name):
    try:
        response = s3.generate_presigned_url('get_object',
                                                  Params={'Bucket': app.config["AWS_BUCKET_NAME"],'Key': file_name},
                                                  ExpiresIn=3600)
        return response
    
    except ClientError as e:
        return e
