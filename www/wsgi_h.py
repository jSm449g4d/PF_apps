### DONT LOAD "wsgi_util.py" DIRECTLY as multiple loading causes multiple declarations of variables  ###

import sys
import os
import json
from google.cloud import firestore
from google.cloud import storage

# AP_setting_management
access_counter = 0
resouce_active = "×:FALSE"
try:
    with open("Flask/config.json", "r", encoding="utf-8") as fp:
        db = firestore.Client.from_service_account_json(
            "FirebaseAdmin_Key.json")
        GCS = storage.Client.from_service_account_json(
            "FirebaseAdmin_Key.json").get_bucket(json.load(fp)["GCS_bucket"])
    resouce_active = "〇:OK"
except:
    0
