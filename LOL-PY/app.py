from distutils.command.upload import upload
from distutils.version import Version
from flask import Flask, redirect, url_for, render_template, request, session, jsonify, flash, current_app, make_response
from flask_cors import CORS, cross_origin

from database import app
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_api import status

from flask_sqlalchemy import SQLAlchemy
from searchCount import search_text
from document import upload_multiDocs, dl, getAllDocs, Document
from versioning import Versioning
from user import User
import jwt, datetime, bcrypt, json

import requests

bcrypt = Bcrypt(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
db = SQLAlchemy(app)

@app.route('/search/<string:question>', methods=["GET"])
def search_results(question):

    code, data = search_text(question)
    data = (sorted(data, key=lambda x: x['count'], reverse=True))
    return jsonify(
        {
            "code": code,
            "data": {
                "course": data
            }
        }
    )

@app.route('/')
def index():
    return render_template('test.html')

# app.config['MAX_CONTENT_LENGTH'] = file_mb_max * 1024 * 1024

@app.route('/upload', methods=['POST'])
@cross_origin()
def upload_files():
    if request.method == 'POST':
        # print(request.get_json())

    # files = request.files.listvalues()
        docs = request.json
    if len(docs) == 0:
        return 'No documents found, try again.'
    else:
        # file = request.json
        # print(files)

        # files = request.files.getlist('file')
        print(f"Number of documents uploaded: {len(docs)}")
        # return upload_doc(file)
        return upload_multiDocs(docs)
    
@app.route('/updateDoc/<doc_id>/<doc_title>/<doc_journey>', methods=['POST'])
def updateDocDetails(doc_id, doc_title, doc_journey):
    doc = Document.query.filter_by(docID=doc_id).first()
    new_doc = Versioning(userID = doc.userID, docID = doc.docID, docName = doc.docName, docTitle = doc.docTitle,
                     docType = doc.docType, journey = doc.journey, docLink = doc.docLink, lastUpdated= doc.lastUpdated, upload_status= doc.upload_status)
    
    doc.docTitle = doc_title
    doc.journey = doc_journey
    try: 
        db.session.merge(new_doc)
        db.session.merge(doc)
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
        
        
@app.route('/getDocDetails', methods=['GET'])
def getDocDetails():
    docs = Document.query.order_by(Document.lastUpdated.desc())
    return getAllDocs(docs)

@app.route('/getDocDetails/<doc_id>', methods=['GET'])
def getDocInfo(doc_id):
    doc = Document.query.filter_by(docID=doc_id).first()
    return jsonify({"docID": doc.docID, "docName": doc.docName, "docTitle": doc.docTitle, "docLink": doc.docLink, "journey": doc.journey })

@app.route('/getDoc/<file_name>', methods=['GET'])
def getDoc(file_name):
    return Document.query.filter_by(uploadID=file_name).first()

@app.route('/download/<upload_id>')
def download(upload_id):
    return dl(upload_id)

@app.route('/login', methods=['POST'])
def login():
    json_data = request.json
    auth = request.authorization
    
    user = User.query.filter_by(userID=json_data['userName']).first()
    if user and bcrypt.check_password_hash(user.password, json_data['password']):
        session['logged_in'] = True
        token = jwt.encode({'userName': user.userID, 'password': json_data['password']}, app.config['SECRET_KEY'], "HS256")
        return jsonify({'token': token})
    else:
        return "Incorrect username and password!", status.HTTP_400_BAD_REQUEST  


@app.route('/login/<string:token>', methods=['GET'])
def getUser(token):
    user = User.query.filter_by(token=token).first()
    return jsonify({"userID": user.userID, "userName": user.userName, "role": user.role})
         

if __name__ == '__main__':
    app.secret_key = 'is484t6'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.run(host='0.0.0.0', port=2222, debug=True)
