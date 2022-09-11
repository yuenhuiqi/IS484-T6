from database import *
import bcrypt

class User(db.Model):
    __tablename__ = 'users'

    userID = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(30), nullable = False)
    role = db.Column(db.String(30), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __init__(self, userName, role):
        self.userName = userName
        self.role = role
        self.password = generateHash("is484t6")


def generateHash(pw):
    bytePw = pw.encode('utf-8')
    mySalt = bcrypt.gensalt()
    hashedPw = bcrypt.hashpw(bytePw, mySalt)
    return hashedPw
    
    
