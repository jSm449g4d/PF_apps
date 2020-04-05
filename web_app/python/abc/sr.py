from flask import  render_template_string,send_file
from werkzeug.utils import secure_filename
import os
import datetime
import zipfile
import time
import threading
from urllib import parse
import urllib3
import certifi
#import wsgi_util

def show(req):
    return "AAA"
    if req.method == 'POST':
        return "AAA"
        