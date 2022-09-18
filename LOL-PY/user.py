from database import *
import bcrypt, jwt, datetime

class User(db.Model):
    __tablename__ = 'users'

    userID = db.Column(db.String(30), primary_key=True)
    userName = db.Column(db.String(30), nullable = False)
    role = db.Column(db.String(30), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    token = db.Column(db.String(255), nullable=False)

    def __init__(self, userID, userName, role):
        self.userID = userID
        self.userName = userName
        self.role = role
        self.password = generateHash("is484t6")
        self.token = encodeToken(userID)


def generateHash(pw):
    bytePw = pw.encode('utf-8')
    mySalt = bcrypt.gensalt()
    hashedPw = bcrypt.hashpw(bytePw, mySalt)
    return hashedPw

def encodeToken(userName):
    return jwt.encode({'userName': userName, 'password': 'is484t6'}, 'is484t6', "HS256")

def getUserByID(userID):
    user = User.query.filter_by(userID=userID).first()
    return user.userName
    
    
