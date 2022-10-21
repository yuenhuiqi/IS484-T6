from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *

DB_URI = 'mysql+mysqlconnector://root@localhost:3306/fypdb'
# DB_URI = 'mysql+mysqlconnector://admin:lesgoAdmin@fypdb.c8ob3ug8qjhh.ap-southeast-1.rds.amazonaws.com:3306/fypDB'
app = Flask(__name__)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.config["SQLALCHEMY_DATABASE_URI"]= DB_URI

db = SQLAlchemy(app)
