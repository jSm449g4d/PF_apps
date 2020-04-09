import flask
import os
import sys
import threading
import time
import importlib
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json

try:
    wsgi_h = importlib.import_module("wsgi_h")
    db = wsgi_h.db
except:
    firebase_admin.initialize_app()
    db = firestore.client()

def render_template_FaaS(dir, **kwargs):
    html = ""
    with open(os.path.join(dir), "r", encoding="utf-8") as f:
        html = f.read()
        for kw, arg in kwargs.items():
            html = html.replace("{{"+kw+"}}", arg)
    return flask.render_template_string(html)


def deamon():
    while True:
        try:
            time.sleep(3)
        #    docs=wsgi_util.db.collection("nicoapi").stream()
        #    print(docs)
        except:
            return True

# threading.Thread(name='nicoapi_d', target=deamon).start()


def show(request):
    dicts = db.document('tptef/main').get().to_dict()
#    return "test"
    return json.dumps(dicts)

#    return render_template_FaaS(os.path.join(os.path.dirname(__file__), "main.html"))
