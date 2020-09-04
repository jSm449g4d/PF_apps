# Standard
import hashlib
import os
import sys
import importlib
import json
import threading
import time
from urllib import parse
# Additional
import flask
import urllib3
import certifi

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,Session
from sqlalchemy.orm.exc import NoResultFound
import hashlib

# application
print("Login")
engine = create_engine('sqlite:///db.sqlite3')
Base = declarative_base()
class Users(Base):
    __tablename__ = 'users'
    uid = Column(String(32), primary_key=True)
    name = Column(String(64))
    mail = Column(String(128))
    passhash = Column(String(32))
Base.metadata.create_all(engine)
session = Session( bind = engine,autocommit = False, autoflush = True)

def show(request):
    _dataDict = json.loads(request.get_data())
    if ("login" in _dataDict):
        _user=session.query(Users).filter(Users.uid==_dataDict["login"]["uid"])
        dic = { 'uid': _dataDict["login"]["uid"], 'pass': _dataDict["login"]["pass"] }
        if _user.count()==0
            session.add(Users(uid=_dataDict["login"]["uid"],passhash=hashlib.sha256(_dataDict["login"]["pass"].encode()).hexdigest()))
            session.commit()
            return flask.make_response("register_account").set_cookie('wsgi_login', value = json.dumps(dic)),200
        else:
            if(_user.passhash==hashlib.sha256(_dataDict["login"]["pass"].encode()).hexdigest()):
                return flask.make_response("accepted_login").set_cookie('wsgi_login', value = json.dumps(dic)),200
            else:
                return "rejected_login",200    

    if ("logout" in _dataDict):
        return flask.make_response("logouted").set_cookie('wsgi_login', value = json.dumps({})),200
    
    cookie = request.cookies.get('wsgi_login')
    print(cookie)

    if request.method == "GET":
        return response

    # render
    kwargs = {}
    with open(os.path.join(os.path.dirname(__file__), "main.html"), "r", encoding="utf-8") as f:
        html = f.read()
        for kw, arg in kwargs.items():
            html = html.replace("{{"+kw+"}}", arg)
        return flask.render_template_string(html)
    return "404: nof found → main.html", 404
