from werkzeug.utils import secure_filename
import os
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import auth
from google.cloud import firestore
import wsgi_util

def show(req):
    orders=""
    if req.method == 'POST' or req.method == "GET":
        
        try:
            orders="T0"
            orders=req.form["fbtoken"]
            
            uid = auth.verify_id_token(
                secure_filename(req.form["fbtoken"]))["uid"]
            orders="T1"
            doc_ref = wsgi_util.db.collection("mypage").document(uid)
            orders="T2"
            doc_ref.set({}, merge=True)
            orders="T3"
            orders=uid
        except:
            False
            
    return wsgi_util.render_template_2("mypage.html",ORDERS=orders,)
