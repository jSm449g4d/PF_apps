from werkzeug.utils import secure_filename
import os
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import auth
from google.cloud import storage
import wsgi_util

#from google.cloud import storage

def show(req):
    if req.method == 'POST' or req.method == "GET":
        False
    return wsgi_util.render_template_2("mypage.html")
