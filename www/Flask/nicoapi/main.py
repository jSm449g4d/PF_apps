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
with open(os.path.join(os.path.dirname(__file__), "config.json"), "r", encoding="utf-8") as fp:
    try:  # on CaaS
        wsgi_h = importlib.import_module("wsgi_h")
        db = wsgi_h.db
        storage = wsgi_h.GCS.get_bucket(json.load(fp)["GCS_bucket"])
    except:  # on FaaS
        db = firestore.Client()
        storage = firestorage.Client().get_bucket(json.load(fp)["GCS_bucket"])


def deamon():
    # DB layer
    https = urllib3.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=certifi.where(
    ), headers={"User-Agent": "nicoapi"})
    docRefs = db.collection('nicoapi').list_documents()
    for docRef in docRefs:
        recodes = docRef.get().to_dict()
        # Document layer
        for timestamp, order in recodes.items():
            with io.BytesIO() as inmemory_zip:
                for url in order["request_urls"]:
                    print(hashlib.md5(url.encode('utf-8')).hexdigest())
                    time.sleep(3)
                    try:
                        resp_json = https.request('GET', parse.quote(
                            url, safe="=&-?:/%")).data.decode('utf-8')
                        with zipfile.ZipFile(inmemory_zip, 'a', compression=zipfile.ZIP_DEFLATED) as zf:
                            zf.writestr(hashlib.md5(url.encode(
                                'utf-8')).hexdigest(), json.dumps(resp_json, ensure_ascii=False))
                        storage.blob("nicoapi/"+docRef.id + "/"+timestamp +
                                     ".zip").upload_from_string(inmemory_zip.getvalue())
                    except:
                        pass


thread_d = threading.Thread(name='nicoapi_d', target=deamon)


def show(request):
    # head ← (template)
    global access_counter
    access_counter += 1
    status_lines = "<h6 class='text-center'>==STATUS==<br>"
    status_lines += "Access Counter :" + str(access_counter) + "<br>"

    # body
    global thread_d
    if thread_d.is_alive() == False:
        thread_d = threading.Thread(name='nicoapi_d', target=deamon)
        thread_d.start()
        status_lines += "Thread start!!<br>"

    # foot ← (template)
    status_lines += "<h6>"
    kwargs = {"STATUS_LINES": status_lines}
    with open(os.path.join(os.path.dirname(__file__), "main.html"), "r", encoding="utf-8") as f:
        html = f.read()
        for kw, arg in kwargs.items():
            html = html.replace("{{"+kw+"}}", arg)
        return flask.render_template_string(html)
    return "404: nof found → main.html", 404
