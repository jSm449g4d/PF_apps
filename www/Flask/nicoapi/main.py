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
from datetime import datetime
# Additional
import flask
import urllib3
import certifi
from google.cloud import firestore
from google.cloud import storage as firestorage


# global variable
access_counter = 0
restartflag: bool = False

# application
with open(os.path.join(os.path.dirname(__file__), "config.json"), "r", encoding="utf-8") as fp:
    try:  # on CaaS
        wsgi_h = importlib.import_module("wsgi_h")
        db = wsgi_h.db
        DELETE_FIELD = wsgi_h.DELETE_FIELD
        storage = wsgi_h.GCS.get_bucket(json.load(fp)["GCS_bucket"])
    except:  # on FaaS
        db = firestore.Client()
        DELETE_FIELD = firestore.DELETE_FIELD
        storage = firestorage.Client().get_bucket(json.load(fp)["GCS_bucket"])


def deamon():
    global restartflag
    while restartflag == True:
        restartflag = False
        start_timestamp: int = int(datetime.now().timestamp()*1000)
        # DB layer
        docRefs = db.collection('nicoapi').list_documents()
        for docRef in docRefs:
            recodes: dict = docRef.get().to_dict()
            # Document layer
            # No recode, No Document
            if len(recodes) < 1:
                docRef.delete()
                continue
            for tsuid, order in recodes.items():
                # 7days to delete
                if int(datetime.now().timestamp()*1000) > int(tsuid.split("_")[0])+604800000:
                    recodes[tsuid] = DELETE_FIELD
                    if storage.blob("nicoapi/"+docRef.id + "/"+tsuid + ".zip").exists() == True:
                        storage.blob("nicoapi/"+docRef.id + "/" +
                                     tsuid + ".zip").delete()
                    continue
                # downloaded data is not exist on GCS → delete
                if recodes[tsuid]["status"] == "processed":
                    if storage.blob("nicoapi/"+docRef.id + "/"+tsuid + ".zip").exists() == False:
                        recodes[tsuid] = DELETE_FIELD
                    continue
                with io.BytesIO() as inmemory_zip:
                    # set https UserAgent
                    https = urllib3.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=certifi.where(
                    ), headers={"User-Agent": order["User-Agent"]})
                    # start Crawl
                    for url in order["request_urls"]:
                        print(hashlib.md5(url.encode('utf-8')).hexdigest())
                        time.sleep(3)
                        try:
                            resp_json = https.request('GET', parse.quote(
                                url, safe="=&-?:/%")).data.decode('utf-8')
                            with zipfile.ZipFile(inmemory_zip, 'a', compression=zipfile.ZIP_DEFLATED) as zf:
                                zf.writestr(hashlib.md5(url.encode(
                                    'utf-8')).hexdigest(), json.dumps(resp_json, ensure_ascii=False))
                            storage.blob("nicoapi/"+docRef.id + "/"+tsuid +
                                         ".zip").upload_from_string(inmemory_zip.getvalue())
                        except:
                            pass
                recodes[tsuid]["status"] = "processed"
            docRef.set(recodes, merge=True)
        # prevent high freq restart
        while int(datetime.now().timestamp()*1000) < start_timestamp+3000:
            time.sleep(1)


thread_d = threading.Thread(name='nicoapi_d', target=deamon)


def show(request):
    global access_counter
    access_counter += 1
    statusDict: dict = {
        "access_counter": str(access_counter),
        "thread": "running", }

    global thread_d, restartflag
    if thread_d.is_alive() == False:
        restartflag = True
        thread_d = threading.Thread(name='nicoapi_d', target=deamon)
        thread_d.start()
        statusDict["thread"] = "start"
    else:
        restartflag = True

    if request.method == "POST":
        return json.dumps(statusDict, ensure_ascii=False), 200

    # showStatus
    statusLines: str = "<h6 class='text-center'>==STATUS==</h6>"
    for key, value in statusDict.items():
        statusLines += "<div class='text-center' >" + key+": "+value+"</div>"
    kwargs = {"STATUS_LINES": statusLines}
    # render
    with open(os.path.join(os.path.dirname(__file__), "main.html"), "r", encoding="utf-8") as f:
        html = f.read()
        for kw, arg in kwargs.items():
            html = html.replace("{{"+kw+"}}", arg)
        return flask.render_template_string(html)
    return "404: nof found → main.html", 404
