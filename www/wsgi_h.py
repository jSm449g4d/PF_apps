### DONT LOAD "wsgi_h.py" DIRECTLY as multiple loading causes multiple declarations of variables  ###

# Standard
import os
import json
# Additional
from google.cloud import firestore
from google.cloud import storage as firestorage

access_counter = 0
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
