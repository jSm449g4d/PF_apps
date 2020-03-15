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
    orders = ""
    if req.method == 'POST' or req.method == "GET":
        try:
            uid = auth.verify_id_token(
                secure_filename(req.form["fbtoken"]))["uid"]
            doc_ref = wsgi_util.db.collection("mypage").document(uid)
            doc_ref.set({}, merge=True)
            orders += "<div>"+uid+"</div>"
            doc_ref.update({
                "topic1": "content1",
                "topic2": "content2",
                "topic3": "content3",
                "topic4": "content4", })

            for k, v in sorted(doc_ref.get().to_dict().items()):
                orders += "<div><h6>"+k+"</h6>"+v+"</div>"
        except:
            False

    return wsgi_util.render_template_2("mypage.html", ORDERS=orders,)
