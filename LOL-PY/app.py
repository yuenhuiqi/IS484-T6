from flask import Flask, redirect, url_for, render_template, request, session, jsonify, flash, current_app, make_response
from flask_cors import CORS, cross_origin

from database import app
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_api import status

from flask_sqlalchemy import SQLAlchemy
from searchCount import search_text
from document import Document, upload_multiDocs, dl, getAllDocs, deleteDocFromS3
from user import User
import jwt, datetime, bcrypt

import requests

bcrypt = Bcrypt(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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
    # if request.method == 'POST':
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

@app.route('/getDocDetails', methods=['GET'])
def getDocDetails():
    docs = Document.query.order_by(Document.lastUpdated.desc())
    return getAllDocs(docs)

@app.route('/deleteDoc', methods=['POST'])
def deleteDoc():
    docName = request.json["docName"]
    print(docName)
    deleteDocFromS3(docName)
    # Document.query.filter_by(docID=id).delete()
    # db.session.commit()
    # doc = Document.query.filter_by(docID=docID).first()
    return "Document deleted!"

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
