from distutils.command.upload import upload
from distutils.version import Version
from multiprocessing import AuthenticationError
from urllib import response
from flask import Flask, redirect, url_for, render_template, request, session, jsonify, flash, current_app, make_response, abort
from flask_cors import CORS, cross_origin

from database import app
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_api import status
from flask_sqlalchemy import SQLAlchemy

from searchCount import search_text, add_count, getSuggestedSearches
from document import *
from versioning import getAllVersions
from user import User
from acronym import Acronym
from feedback import add_querydoc_count, update_feedback, get_feedback

import jwt
import bcrypt
import functools

bcrypt = Bcrypt(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
db = SQLAlchemy(app)

import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("APIKEY")

# authentication decorator, source: https://blog.teclado.com/api-key-authentication-with-flask/ 
def auth(func):
    @functools.wraps(func)
    def decorator(*args, **kwargs):
        if not "Authorization" in request.headers:
            abort(401)
        if request.headers.get("Authorization") != API_KEY:
            abort(401)
        return func(*args, **kwargs)
    return decorator

@app.route('/search/<path:question>', methods=["GET"])
@auth
def search_results(question):
    code, data = search_text(question)
    data = (sorted(data, key=lambda x: x['count'], reverse=True))
    return jsonify(
        {
            "code": code,
            "data": {
                "queryList": data
            }
        }
    )


@app.route('/getFeedback/<path:docID>/<path:query>', methods=['POST'])
@auth
def retrieve_feedback(docID,query):

    code, data = get_feedback(docID, query)
    return jsonify(
        {
            "code": code,
            "data": data
            
        }
    )


@app.route('/addQueryCount/<path:question>', methods=["POST"])
@auth
def search_query(question):
    code, data = add_count(question)
    return jsonify(
        {
            "code": code,
            "data": {
                "status": data
            }
        }
    )


@app.route('/feedback/<path:searchID>/<path:docID>/<path:score>', methods=["POST"])
@auth
def feedback(searchID, docID, score):

    code, data = update_feedback(searchID, docID, score)
    return jsonify(
        {
            "code": code,
            "data": data
        }
    )


@app.route('/addFeedback/<path:searchID>/<path:docID>', methods=["POST"])
@auth
def addfeedback(searchID, docID):
    code, data = add_querydoc_count(searchID, docID)
    
    return jsonify(
        {
            "code": code,
            "data": {
                "status": data
            }
        }
    )

# app.config['MAX_CONTENT_LENGTH'] = file_mb_max * 1024 * 1024
@app.route('/upload', methods=['POST'])
@cross_origin()
@auth
def upload_files():
    docs = request.json
    if len(docs) == 0:
        return 'No documents found, please try again.'
    else:
        return upload_multiDocs(docs)


@app.route('/getAllDocDetails/<string:docTitle>/<int:page_size>/<int:page>', methods=['GET'])
@auth
def getAllDocDetails(docTitle, page_size, page):
    return search_doc(docTitle, page_size, page)


@app.route('/getDocDetails/<doc_id>', methods=['GET'])
@auth
def getDocDetails(doc_id):
    doc = Document.query.filter_by(docID=doc_id).first()
    return jsonify({'docTitle': doc.docTitle, 'journey': doc.journey, 'docName': doc.docName, 'docType': doc.docType})


@app.route('/updateDoc/<doc_id>/<doc_title>/<doc_journey>', methods=['POST'])
@auth
def updateDoc(doc_id, doc_title, doc_journey):
    doc = Document.query.filter_by(docID=doc_id).first()
    return update_docDetails(doc, doc_title, doc_journey)


@app.route('/deleteDoc', methods=['POST'])
@auth
def deleteDoc():
    docName = request.json["docName"]
    deleteAllDocVersions(docName)

    return "Document deleted!"


@app.route('/getAllVersions/<doc_id>', methods=['GET'])
@auth
def getAllVersionsDetails(doc_id):
    return getAllVersions(doc_id)

@app.route('/presignedUrl/<doc_id>', methods=['GET'])
@auth
def getUrl(doc_id):
    doc = Document.query.filter_by(docID=doc_id).first()
    presignedUrl = getPresignedUrl(doc.docName)
    return jsonify({'presignedUrl': presignedUrl })


@app.route('/login', methods=['POST'])
@auth
def login():
    json_data = request.json
    user = User.query.filter_by(userID=json_data['userName']).first()
    if user and bcrypt.check_password_hash(user.password, json_data['password']):
        session.logged_in = True
        token = jwt.encode(
            {'userName': user.userID, 'password': json_data['password']}, app.config['SECRET_KEY'], "HS256")
        return jsonify({'token': token})
    else:
        return "Incorrect username and password!", status.HTTP_400_BAD_REQUEST


@app.route('/login/<string:token>', methods=['GET'])
@auth
def getUser(token):
    user = User.query.filter_by(token=token).first()
    return jsonify({"userID": user.userID, "userName": user.userName, "role": user.role})


@app.route('/getAllAcronyms/<path:question>', methods=['GET'])
@auth
def getAcronymMeaning(question):
    qn = '{0}'.format(question)
    qn = qn.lower().rstrip('_+!@#$?^/ ').split()
    acronyms = Acronym.query.all()
    arr = []
    for acronym in acronyms:
        if str(acronym.acronym).lower() in qn:
            acronym_dict = {}
            acronym_dict['acronym'] = acronym.acronym
            acronym_dict['meaning'] = acronym.meaning
            arr.append(acronym_dict)

    if len(arr) == 0:
        return "No acronym found", status.HTTP_404_NOT_FOUND
    return jsonify({'acronyms': arr}), 200


@app.route('/getSuggestedQueries/<path:query>', methods=['GET'])
@auth
def getSuggested(query):
    return jsonify({'suggestedSearches': getSuggestedSearches(query)})

# moved these out of the if __name__ == '__main__' block because I want it to run when we run the app using the flask command
# instead of using python3 app.py
app.secret_key = 'is484t6'
app.config['SESSION_TYPE'] = 'filesystem'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2222, debug=True)
