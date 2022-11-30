from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *

DB_URI = 'mysql+mysqlconnector://root:root@localhost:3306/fypdb'

# switch to AWS RDS after you've set it up
# DB_URI = ''

app = Flask(__name__)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.config["SQLALCHEMY_DATABASE_URI"]= DB_URI

db = SQLAlchemy(app)
