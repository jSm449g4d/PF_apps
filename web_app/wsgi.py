# coding: utf-8
import sys
import os
import flask
from flask import request, send_file, render_template
import importlib

# Flask_Startup
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.chdir(os.path.join("./", os.path.dirname(__file__)))
app = flask.Flask(__name__)
wsgi_util = importlib.import_module("wsgi_util")
# prevent uploading too large file
app.config['MAX_CONTENT_LENGTH'] = 100000000

# Flask Index
@app.route("/")
def indexpage_show():
    wsgi_util.access_counter += 1
    return render_template("index.html",
                           STATUS_PYTHON_VERSION=sys.version,
                           STATUS_FLASK_VERSION=flask.__version__,
                           STATUS_ACCESS_COUNT=str(wsgi_util.access_counter),
                           STATUS_RESOURCE_ACTIVE=wsgi_util.resouce_active)

# favicon.ico+robots.txt
@app.route('/<name>')
def favirobo(name):
    try:
        return send_file(os.path.join("html", name).replace("\\", "/").replace("..", "_")), 200
    except:
        return "error", 500

# HTML pages
@app.route("/<path:name>.html")
def html_show(name):
    try:
        return send_file(os.path.join("html", name).replace("\\", "/").replace("..", "_")+".html"), 200
    except Exception as e:
        return render_template("error.html", STATUS_ERROR_TEXT=str(e)), 500

# FaaS by Python3
@app.route("/<path:name>.py")
def py_show(name):
    try:
        return importlib.import_module("python."+name.replace("/", ".").replace("..", "_")).show(request), 200
    except Exception as e:
        return render_template("error.html", STATUS_ERROR_TEXT=str(e)), 500


application = app

if __name__ == "__main__":
    app.run()
