from flask import Flask, redirect, url_for, render_template, request, session, jsonify, flash, current_app, make_response
from flask_cors import CORS, cross_origin

from database import app
from flask_bcrypt import Bcrypt

from flask_sqlalchemy import SQLAlchemy
from searchCount import search_text
from multi_uploader import upload_multiDocs, dl
from user import User

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
    if request.method == 'POST':
        print(request.files)

    files = request.files.listvalues()
    if len(files) == 0:
        return 'No files found, try again.'
    else:
        # file = request.json
        print(files)

        # files = request.files.getlist('file')
        print(f"Number of files uploaded: {len(files)}")
        # return upload_doc(file)
        return upload_multiDocs(files)

@app.route('/download/<upload_id>')
def download(upload_id):
    return dl(upload_id)

@app.route('/login', methods=['POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(userName=json_data['userName']).first()
    if user and bcrypt.check_password_hash(
            user.password, json_data['password']):
        session['logged_in'] = True
        status = True
    else:
        status = False
    return jsonify({'result': status})

if __name__ == '__main__':
    app.secret_key = 'is484t6'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.run(host='0.0.0.0', port=2222, debug=True)
