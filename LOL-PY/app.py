from flask import Flask, redirect, url_for, render_template, request, session, jsonify
from database import app

from flask_sqlalchemy import SQLAlchemy
from searchCount import search_text

@app.route('/search/<string:question>', methods=["GET"])
def search_results(question):
    
    code, data = search_text(question)
    data = (sorted(data, key=lambda x: x['count'],reverse=True))
    return jsonify(
                {
                    "code":code,
                    "data": {
                        "course" : data
                        }
                }
            )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2222, debug=True)