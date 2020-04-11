# server
import flask
import os
import sys
# application
import importlib
import json
import threading
import time
from google.cloud import firestore
from google.cloud import storage as firestorage
from datetime import datetime


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

debug="none"
# application
def deamon():
    # daemon_init
    daemon_loop = False
    with open(os.path.join(os.path.dirname(__file__), "config.json"), "r", encoding="utf-8") as fp:
        try:
            wsgi_h = importlib.import_module("wsgi_h")
            db = wsgi_h.db
            storage = wsgi_h.GCS.get_bucket(json.load(fp)["GCS_bucket"])
#           daemon_loop = True
        except:
            global debug;
            db = firestore.Client()
            storage = firestorage.Client().get_bucket(json.load(fp)["GCS_bucket"])
            debug="2"
        
    # daemon_loop_process
    while True:
        debug="3"
        docRefs = db.collection('nicoapi').list_documents()
        for docRef in docRefs:
            debug="4"
            
            docRef.update({str(int(datetime.now().timestamp()*1000)):["start!"]})

            recodes = docRef.get().to_dict()
            for recode in recodes.values():
                for data in recode:
                    time.sleep(3)
                    print("rec:"+data)

            docRef.update({str(int(datetime.now().timestamp()*1000)):["finish!"]})

        print("end")
        debug="5"

        # daemon_loop_management
        time.sleep(300)
        if daemon_loop == False:
            return 0

    return 0


threading.Thread(name='nicoapi_d', target=deamon).start()

def show(request):
    global debug;
    return render_template_FaaS(os.path.join(os.path.dirname(__file__), "main.html"),DEBUG=debug)
