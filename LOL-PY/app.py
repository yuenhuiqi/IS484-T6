from flask import Flask, redirect, url_for, render_template, request, session, jsonify, flash, current_app, make_response
from flask_cors import CORS, cross_origin

from database import app

from flask_sqlalchemy import SQLAlchemy
from searchCount import search_text
from multi_uploader import dl, upload_doc, upload_multiDocs

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2222, debug=True)
