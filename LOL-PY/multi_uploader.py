import uuid
from datetime import datetime
from io import BytesIO

from database import *
from flask import Flask, render_template, request, send_file, flash

class Upload(db.Model):
    tablename = 'UploadedDocs'

    uploadID = db.Column(db.String(200), primary_key=True)
    filename = db.Column(db.String(200), nullable = False)
    data = db.Column(db.LargeBinary)
    uploadDateTime = db.Column(db.DATETIME, nullable = False)
    uploaded_by = db.Column(db.String(100))


ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_doc(file):
    id = uuid.uuid1()
    id = id.hex

    dt = str(datetime.now())

    data = file.read()

    upload = Upload(uploadID=id, filename=file.filename, data=data, uploadDateTime=dt)
    db.session.add(upload)
    db.session.commit()

    print(f'Uploaded: {file.filename, id, dt}')

def upload_multiDocs(files):
    print("--------")
    for file in files:
        if file and allowed_file(file.filename):
            upload_doc(file)
        else:
            return "File extension unknown, unable to download"
    
    return f'All files saved to db!'

def dl(upload_id):
    upload = Upload.query.filter_by(uploadID=upload_id).first()
    print(f'{upload.filename} downloaded!')
    return send_file(BytesIO(upload.data), attachment_filename=upload.filename, as_attachment=True)

