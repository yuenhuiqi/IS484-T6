from database import *
from keywordss import Keywordss

from asyncio.windows_events import NULL
import uuid
from datetime import datetime
from io import BytesIO
from base64 import b64decode
from http import HTTPStatus
import boto3

import enum
from sqlalchemy import Enum
from flask import Flask, render_template, request, send_file, flash



class UploadStatus(enum.Enum):
    """
    Serves as enum values for upload_status column of files table
    (either PENDING, PROCESSING, COMPLETE OR ERROR)
    """
    PENDING = 1
    PROCESSING = 2
    COMPLETE = 3
    ERROR = 4


doc_kw = db.Table('doc_kw',
                    db.Column('dk_docID', db.Integer, db.ForeignKey('document.docID')),
                    db.Column('dk_keywordID', db.Integer, db.ForeignKey('keywordss.keywordID'))
                    )


class Document(db.Model):
    __tablename__ = 'document'

    userID = db.Column(db.Integer, nullable=False)
    docID = db.Column(db.String(200), nullable=False, primary_key=True)
    docName = db.Column(db.String(200), nullable=False)
    docLink = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(200), nullable=False)
    lastUpdated = db.Column(db.DATETIME, nullable=False)
    upload_status = db.Column(
        Enum(UploadStatus), nullable=False, default=UploadStatus.PENDING
    )
    keywords = db.relationship('Keywordss', secondary=doc_kw, backref = 'documents')
    
    def __init__(self, userID, docName, docLink, category):
        self.userID = userID
        self.docName = docName
        self.docLink = docLink
        self.category = category
        now = datetime.now()
        self.lastUpdated = now.strftime("%d/%m/%Y %H:%M:%S")



app.config['AWS_ACCESS_KEY'] = "AKIATQNEAAZWJVRPYX56"
app.config['AWS_SECRET_ACCESS_KEY'] = '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'
app.config['AWS_BUCKET_NAME'] = 'is484t6'
app.config['AWS_DOMAIN'] = 'http://is484t6.us-east-1.s3.amazonaws.com/'


s3 = boto3.client(
    "s3",
    aws_access_key_id=app.config["AWS_ACCESS_KEY"],
    aws_secret_access_key=app.config["AWS_SECRET_ACCESS_KEY"],
)


ALLOWED_EXTENSIONS = {'txt', 'pdf', 'ppt','pptx', 'doc', 'docx'}


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_doc_to_s3(file, fn):
    try:
        s3.upload_fileobj(
            file,
            app.config["AWS_BUCKET_NAME"],
            fn,
            ExtraArgs={
                "ContentType": file.content_type  # Set appropriate content type as per the file
            }
        )
    except Exception as e:
        print("Something Happened: ", e)
        return "Err", e

    return "{}{}".format(app.config["AWS_DOMAIN"], fn)


def upload_doc(file):
    id = uuid.uuid1()
    id = id.hex

    dt = str(datetime.now())
    user = '2'

    fn = file.filename
    # data = file.read()
    # fn=file['filename']
    # data = b64decode(file['data'].split(",").pop())

    try:
        upload = Document(docID=id, docName=fn, lastUpdated=dt,
                        userID=user, upload_status=UploadStatus.PROCESSING)
        db.session.add(upload)
        db.session.commit()

        docLink = upload_doc_to_s3(file, fn)
        if docLink[0] == "Err":
            Document.query.filter_by(docID=id).delete()
            db.session.commit()
            return 'Err', docLink[1]
        else:
            upload.docLink = docLink
            upload.upload_status = UploadStatus.COMPLETE
            db.session.commit()

            print(f'Uploaded: {fn, id, dt}')
            return f'Uploaded: {fn, id, dt}', HTTPStatus.OK

    except Exception as e:
        upload.upload_status = UploadStatus.ERROR
        db.session.commit()
        return str(e), HTTPStatus.INTERNAL_SERVER_ERROR


def upload_multiDocs(files):
    print("--------")
    for file in files:

        # print(file[0])
        if file and allowed_file(file[0].filename):
            upload = upload_doc(file[0])
            if upload[0] == 'Err':
                return f'File upload error! {upload[1]}'
        else:
            # print('unknown file')
            return "File extension unknown, unable to download"

    return 'All files uploaded!'


def dl(upload_id):
    upload = Document.query.filter_by(docID=upload_id).first()
    print(f'{upload.filename} downloaded!')
    return send_file(BytesIO(upload.data), attachment_filename=upload.filename, as_attachment=True)
