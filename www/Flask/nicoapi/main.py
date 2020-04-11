# server
import flask
import os
import sys
# application
import threading
import time
import importlib
from google.cloud import firestore

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
def deamon():
    # daemon_init
    daemon_loop = 10
    try:
        wsgi_h = importlib.import_module("wsgi_h")
        db = wsgi_h.db
        daemon_loop = 0
    except:
        db = firestore.Client()
    # daemon_loop
    while True:
        # daemon_loop_management
        time.sleep(3)
        if daemon_loop != 0:
            daemon_loop -= 1
            if daemon_loop < 1:
                return 0

#        doc=db.document('tptef/mains').get().to_dict()
#        print(doc)
        print("aaa")

    return 0


threading.Thread(name='nicoapi_d', target=deamon).start()


def show(request):
    #    dicts = db.document('tptef/main').get().to_dict()
    #    return json.dumps(dicts)
    return render_template_FaaS(os.path.join(os.path.dirname(__file__), "main.html"))
