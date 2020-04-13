# Standard
import hashlib
import os
import sys
import importlib
import json
import threading
import time
from urllib import parse
import io
import zipfile
# Additional
import flask
import urllib3
import certifi
from google.cloud import firestore
from google.cloud import storage as firestorage


# global variable
access_counter = 0


# application
def deamon():
    # daemon_init
    daemon_loop = False
    with open(os.path.join(os.path.dirname(__file__), "config.json"), "r", encoding="utf-8") as fp:
        try:  # on CaaS
            wsgi_h = importlib.import_module("wsgi_h")
            db = wsgi_h.db
            storage = wsgi_h.GCS.get_bucket(json.load(fp)["GCS_bucket"])
            access_counter = wsgi_h.access_counter
#           daemon_loop = True
        except:  # on FaaS
            db = firestore.Client()
            storage = firestorage.Client().get_bucket(
                json.load(fp)["GCS_bucket"])

    # daemon_loop_process
    while True:
        # DB layer
        https = urllib3.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=certifi.where(
        ), headers={"User-Agent": "nicoapi"})
        docRefs = db.collection('nicoapi').list_documents()
        for docRef in docRefs:
            recodes = docRef.get().to_dict()
            # Document layer
            for timestamp, urls in recodes.items():
                with io.BytesIO() as inmemory_zip:
                    for url in urls:
                        time.sleep(3)
                        print(hashlib.md5(url.encode('utf-8')).hexdigest())
                        try:
                            resp_json = https.request('GET', parse.quote(
                                url, safe="=&-?:/%")).data.decode('utf-8')
                            with zipfile.ZipFile(inmemory_zip, 'a', compression=zipfile.ZIP_DEFLATED) as zf:
                                zf.writestr(hashlib.md5(url.encode(
                                    'utf-8')).hexdigest(), json.dumps(resp_json, ensure_ascii=False))
                            storage.blob("nicoapi/"+docRef.id +
                                         "/"+timestamp + ".zip").upload_from_string(inmemory_zip.getvalue())
                        except:
                            pass
        # daemon_loop_management
        time.sleep(300)
        if daemon_loop == False:
            return 0
    return 0


threading.Thread(name='nicoapi_d', target=deamon).start()


def show(request):
    # render template
    global access_counter
    access_counter += 1
    kwargs = {"STATUS_ACCESS_COUNT": str(access_counter)}
    with open(os.path.join(os.path.dirname(__file__), "main.html"), "r", encoding="utf-8") as f:
        html = f.read()
        for kw, arg in kwargs.items():
            html = html.replace("{{"+kw+"}}", arg)
        return flask.render_template_string(html)
    return "404: nof found → main.html", 404
