# server
import flask
import os
import sys
# application
import threading
import time
import importlib
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json


# server
def render_template_FaaS(dir, **kwargs):
    try:
        with open(os.path.join(dir), "r", encoding="utf-8") as f:
            html = f.read()
            for kw, arg in kwargs.items():
                html = html.replace("{{"+kw+"}}", arg)
            return flask.render_template_string(html)
    except:
        return "error:loading main.html"


# application
daemon_loop = 10
try:
    wsgi_h = importlib.import_module("wsgi_h")
    db = wsgi_h.db
    daemon_loop = 0
except:
    firebase_admin.initialize_app()
    db = firestore.client()


def deamon():
    while True:
        # daemon_init
        time.sleep(3)
        if daemon_loop != 0:
            daemon_loop -= 1
            if daemon_loop < 1:
                return 0
        # daemon_process
        print("nicoapi_d:", daemon_loop)
    return 0


threading.Thread(name='nicoapi_d', target=deamon).start()


def show(request):
    dicts = db.document('tptef/main').get().to_dict()
    return json.dumps(dicts)

#    return render_template_FaaS(os.path.join(os.path.dirname(__file__), "main.html"))
