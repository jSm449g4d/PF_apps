### DONT LOAD "wsgi_util.py" DIRECTLY as multiple loading causes multiple declarations of variables  ###

import sys
import os
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
from firebase_admin import firestore
from google.cloud import storage

print("A")

# AP_setting_management
access_counter = 0
config_dict = {}
resouce_active = "×:FALSE"
try:
    os.makedirs("tmp", exist_ok=True)
    firebase_admin.initialize_app(firebase_admin.credentials.Certificate("FirebaseAdmin_Key.json"))
    with open("Flask/config.json", "r", encoding="utf-8") as fp:
        config_dict.update(json.load(fp))
    auth = firebase_admin.auth
    db = firestore.client()
    GCS_bucket = storage.Client.from_service_account_json(
        "FirebaseAdmin_Key.json").get_bucket(config_dict["GCS_bucket"])
    resouce_active = "〇:OK"
except:
    0
