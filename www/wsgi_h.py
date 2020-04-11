### DONT LOAD "wsgi_util.py" DIRECTLY as multiple loading causes multiple declarations of variables  ###

import sys
import os
import json
from google.cloud import storage
from google.cloud import firestore

# AP_setting_management
access_counter = 0
config_dict = {}
resouce_active = "×:FALSE"
try:
    with open("Flask/config.json", "r", encoding="utf-8") as fp:
        config_dict.update(json.load(fp))

    db = firestore.Client.from_service_account_json(
        "FirebaseAdmin_Key.json")

    GCS_bucket = storage.Client.from_service_account_json(
        "FirebaseAdmin_Key.json").get_bucket(config_dict["GCS_bucket"])
    resouce_active = "〇:OK"
except:
    0
