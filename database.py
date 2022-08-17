from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *

DB_URI = 'mysql+mysqlconnector://root:root@localhost:3306/systemdb'
app = Flask(__name__)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.config["SQLALCHEMY_DATABASE_URI"]= DB_URI

db = SQLAlchemy(app)
