# coding: utf-8
import sys
import os
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud import storage

status_table=""
    
#AP_setting_management
access_counter=0;config_dict={};resouce_active="×:FALSE"
try:
    cred = firebase_admin.credentials.Certificate("FirebaseAdmin_Key.json")
    firebase_admin.initialize_app(cred)
    with open("config.json","r",encoding="utf-8") as fp:config_dict.update(json.load(fp))
    os.makedirs(config_dict["temp_folder"], exist_ok=True)
    db = firestore.client()
    GCS_bucket = storage.Client.from_service_account_json("FirebaseAdmin_Key.json").get_bucket(config_dict["GCS_bucket"])
    resouce_active="〇:OK"
except:
    0
