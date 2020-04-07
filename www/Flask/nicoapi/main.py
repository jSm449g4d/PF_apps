import flask
import os
import sys
import threading
import time
# from  import wsgi_util

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

threading.Thread(name='nicoapi_d', target=deamon).start()

def show(request):
    return render_template_FaaS(os.path.join(os.path.dirname(__file__),"main.html"))
