# Standard
import os
import sys
import importlib
from datetime import datetime
import platform
# Additional
import flask
import psutil


# Flask_Startup
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.chdir(os.path.dirname(os.path.join("./", __file__)))
app = flask.Flask(__name__)
wsgi_h = importlib.import_module("wsgi_h")
app.config['MAX_CONTENT_LENGTH'] = 100000000
os.makedirs("tmp", exist_ok=True)

# Index ← Console
@app.route("/")
def indexpage_show():
    wsgi_h.access_counter += 1
    return flask.render_template("Flask_index.html",
                                 STATUS_ACCESS_COUNT=str(
                                     wsgi_h.access_counter),
                                 STATUS_ACCESS_TIMESTAMP=str(
                                     int(datetime.now().timestamp()*1000)),
                                 STATUS_PYTHON_VERSION=sys.version,
                                 STATUS_FLASK_VERSION=flask.__version__,
                                 STATUS_RESOURCE_OS=platform.platform(),
                                 STATUS_RESOURCE_CORE=str(psutil.cpu_count(
                                     logical=False))+" / "+str(psutil.cpu_count()),
                                 STATUS_RESOURCE_MEM='{:,}'.format(psutil.virtual_memory(
                                 ).used)+"[Byte] / "+'{:,}'.format(psutil.virtual_memory().total)+"[Byte]",
                                 STATUS_RESOURCE_HEALTH=wsgi_h.resouce_health,)


# domain/Flask/* ← favicon.ico and robots.txt
@app.route('/<name>')
def favirobo(name):
    try:
        return flask.send_file(os.path.join("html", name).replace("\\", "/").replace("..", "_"))
    except:
        return "error", 500

# domain/html/**/*.html ← webpage
@app.route("/<path:name>.html")
def html_show(name):
    try:
        return flask.send_file(os.path.join("html", name).replace("\\", "/").replace("..", "_")+".html")
    except Exception as e:
        return flask.render_template("Flask_error.html", STATUS_ERROR_TEXT=str(e)), 500

# domain/Flask/**/*.py ← FaaS
@app.route("/<path:name>.py")
def py_show(name):
    try:
        # Domain/Flask/* and Domain/* → Domain/* → Domain/Flask/*
        name = name.replace("Flask/", "")
        print(name)
        return importlib.import_module("Flask."+name.replace("/", ".").replace("..", "_")).show(flask.request)
    except Exception as e:
        return flask.render_template("Flaks_error.html", STATUS_ERROR_TEXT=str(e)), 500


application = app

if __name__ == "__main__":
    app.run()
