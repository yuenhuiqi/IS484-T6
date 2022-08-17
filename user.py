from database import *

class User(db.Model):
    __tablename__ = 'users'

    userID = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(30), nullable = False)
    role = db.Column(db.String(30), nullable=False)

    def __init__(self, userName, role):
        self.userName = userName
        self.role = role


def write_functions_here():
    print( "meeps")
    
