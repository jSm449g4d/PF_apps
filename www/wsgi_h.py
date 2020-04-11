### DONT LOAD "wsgi_h.py" DIRECTLY as multiple loading causes multiple declarations of variables  ###

# application
import json
from google.cloud import firestore
from google.cloud import storage as firestorage

# AP_setting_management
access_counter = 0
resouce_health = "×: FAULT"
GCP_key = "FirebaseAdmin_Key.json"
try:
    db = firestore.Client.from_service_account_json(GCP_key)
    GCS = firestorage.Client.from_service_account_json(GCP_key)
    resouce_health = "〇: GREEN"
except:
    pass
