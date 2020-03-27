# coding: utf-8
import sys
import os
import flask
from flask import  redirect,request,render_template
import importlib

#Flask_Startup
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.chdir(os.path.join("./",os.path.dirname(__file__)))
app = flask.Flask(__name__)
wsgi_util=importlib.import_module("wsgi_util")
#prevent uploading too large file
app.config['MAX_CONTENT_LENGTH'] = 100000000

@app.route("/")
def indexpage_show():
    wsgi_util.access_counter+=1
    return render_template("index.html",
    STATUS_PYTHON_VERSION=sys.version,
    STATUS_FLASK_VERSION=flask.__version__,
    STATUS_ACCESS_COUNT=str(wsgi_util.access_counter),
    STATUS_RESOURCE_ACTIVE=wsgi_util.resouce_active,
    )

@app.route("/<name>.html")
def html_show(name):
    try :return render_template('./'+name+'.html')
    except Exception as e:
        return render_template("error.html",
        form_error_text=str(e)),500

@app.route("/<name>.py")
def py_show(name):
    try :
        return importlib.import_module(name).show(request)
    except Exception as e:
        return render_template("error.html",
        STATUS_ERROR_TEXT=str(e)),500

application=app

if __name__ == "__main__":
    app.run()
