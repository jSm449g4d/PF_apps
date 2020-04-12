### DONT LOAD "wsgi_h.py" DIRECTLY as multiple loading causes multiple declarations of variables  ###

# Standard
import os
import json
# Additional
from google.cloud import firestore
from google.cloud import storage as firestorage


# AP_setting_management
access_counter = 0
resouce_health = "×: FAULT"
GCP_key = "FirebaseAdmin_Key.json"


# Firestore compatible
class db_Ref:
    db_dict = {}
    db_path = ""

    def __init__(self, db_path: str = ""):
        if db_path == "":
            os.makedirs("./db", exist_ok=True)
            try:  # db cleaning ← delete except for json file
                for root, _, files in os.walk("./db"):
                    for file in files:
                        if file.split(".")[-1] != "json":
                            os.remove(os.path.join(root, file))
                    # TODO: delete emp folder
            except:
                pass
        self.db_path = db_path.replace("\\", "/").replace("..", "_")

    def list_documents(self):
        Refs = []
        try:
            for file in os.listdir(os.path.join("./db", self.db_path)):
                Refs.append(
                    db_Ref(os.path.splitext(
                        os.path.join(self.db_path, file))[0])
                )
        except:
            Refs = []
        return Refs

    def get(self):
        try:
            with open(os.path.join("./db", self.db_path), encoding="utf-8") as fp:
                self.db_dict = json.load(fp)
        except:
            self.db_dict = {}
        return self

    def to_dict(self):
        return json.dumps(self.db_dict, ensure_ascii=False)

    def document(self, db_path: str = ""):
        return db_Ref(db_path)

    def collection(self, db_path: str = ""):
        return db_Ref(db_path)


try:
    db = firestore.Client.from_service_account_json(GCP_key)
    GCS = firestorage.Client.from_service_account_json(GCP_key)
    resouce_health = "〇: GCP"
except:
    # UC: STANDALONE mode
    db = db_Ref()
    GCS = 0
    resouce_health = "△: STANDALONE"
