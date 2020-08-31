### DONT LOAD "wsgi_h.py" DIRECTLY as multiple loading causes multiple declarations of variables  ###

# Standard
import os
import json
# Additional
from google.cloud import firestore
from google.cloud import storage as firestorage
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,Session
from sqlalchemy.orm.exc import NoResultFound
import hashlib


# AP_setting_management
access_counter = 0
resouce_health = "×: FAULT"
GCP_key = "keys/FirebaseAdminKey.json"

#engine = create_engine('sqlite:///db.sqlite3')
#Base = declarative_base()
#class Users(Base):
#    __tablename__ = 'users'
#    uid = Column(String(32), primary_key=True)
#    name = Column(String(64))
#    mail = Column(String(128))
#    passhash = Column(String(32))
#Base.metadata.create_all(engine)
#session = Session( bind = engine,autocommit = False, autoflush = True)
#session.add(Users(uid=hashlib.sha256("hogehoge".encode()).hexdigest(),name="hogehoge",mail="",passhash=hashlib.sha256("".encode()).hexdigest()))
#session.commit()

try:
    db = firestore.Client.from_service_account_json(GCP_key)
    DELETE_FIELD = firestore.DELETE_FIELD
    GCS = firestorage.Client.from_service_account_json(GCP_key)
    resouce_health = "〇: GCP"
except:
    # UC: STANDALONE mode
    db = 0
    DELETE_FIELD = None
    GCS = 0
    resouce_health = "UC: (△: STANDALONE)"
