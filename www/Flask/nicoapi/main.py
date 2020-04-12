# server
import flask
import os
import sys
# application
import importlib
import json
import threading
import time
from datetime import datetime
from google.cloud import firestore
from google.cloud import storage as firestorage
import urllib3
import certifi
from urllib import parse
import io
import zipfile


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
    daemon_loop = False
    with open(os.path.join(os.path.dirname(__file__), "config.json"), "r", encoding="utf-8") as fp:
        try:
            wsgi_h = importlib.import_module("wsgi_h")
            db = wsgi_h.db
            storage = wsgi_h.GCS.get_bucket(json.load(fp)["GCS_bucket"])
#           daemon_loop = True
        except:
            db = firestore.Client()
            storage = firestorage.Client().get_bucket(
                json.load(fp)["GCS_bucket"])

    # daemon_loop_process
    while True:
        https = urllib3.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=certifi.where(
        ), headers={"User-Agent": "nicoapi"})
        docRefs = db.collection('nicoapi').list_documents()
        for docRef in docRefs:
            recodes = docRef.get().to_dict()
            for timestamp, urls in recodes.items():
                with io.BytesIO() as inmemory_zip:
                    for url in urls:
                        time.sleep(3)
                        if True:
                            print("access")
                            resp_json = https.request('GET', parse.quote(
                                url, safe="=&-?:/%")).data.decode('utf-8')
                            with zipfile.ZipFile(inmemory_zip, 'a', compression=zipfile.ZIP_DEFLATED) as zf:
                                zf.writestr(str(int(datetime.now().timestamp(
                                )*1000)), json.dumps(resp_json, ensure_ascii=False))
                   # storage.ref("nicoapi/test").put(timestamp+".zip")
                    #storage.blob("nicoapi/test").upload_from_file(inmemory_zip)
                    with open("tmp/"+timestamp+".zip", "wb") as f:
                        f.write(inmemory_zip.getvalue())
            print("end")

        # daemon_loop_management
        time.sleep(300)
        if daemon_loop == False:
            return 0

    return 0


threading.Thread(name='nicoapi_d', target=deamon).start()


def show(request):
    return render_template_FaaS(os.path.join(os.path.dirname(__file__), "main.html"))
