from flask import  render_template_string,send_file
from werkzeug.utils import secure_filename
import os
import hashlib
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import auth
from google.cloud import firestore
import wsgi_util


def show(req):
    
    room=""
    user="Jhon_Doe"
    uid=""
    content=""
    fbtoken=""
    orders=""  
    if req.method == 'POST' or req.method =="GET":
        if "fbtoken" in req.form:fbtoken=secure_filename(req.form["fbtoken"])#Firebase_Token_keep
        if 'room' in req.form:
            room=req.form['room'].translate(str.maketrans("","","\"\'\\/<>%`?;"))#Not_secure_filename!
        if 'user' in req.form:
            user=req.form['user'].translate(str.maketrans("","","\"\'\\/<>%`?;"))#Not_secure_filename!
        try:
            uid=firebase_admin.auth.verify_id_token(fbtoken)["uid"]
        except:
            uid="Null"
        if 'content' in req.form:
            content=req.form['content'].translate(str.maketrans("\"\'\\/<>%`?;",'””￥_〈〉％”？；'))#Not_secure_filename!
        
        if room=="":room="main_page"
        
        doc_ref = wsgi_util.db.collection("tptef").document(room);doc_ref.set({},merge=True)
        if "remark" in req.form and secure_filename(req.form["remark"])=="True":
            doc_ref.update({str(int(datetime.now(pytz.UTC).timestamp())):{
                "user":user,
                "uid": uid,
                "content": content,
                "date":datetime.now(pytz.UTC).strftime("%Y/%m/%d %H:%M:%S %f (UTC)")
            }})
            
        if "clear" in req.form and secure_filename(req.form["clear"])=="True":
            doc=doc_ref.get().to_dict().items()
            for k,v in doc:
                if v["uid"]==uid and k!="Null":
                    doc_ref.update({k:firestore.DELETE_FIELD})
    #show chat thread
        doc=sorted(doc_ref.get().to_dict().items())
        for _,order in doc:
            orders+="<tr><td>"+order["user"]+"</td>"
            orders+="<td>"+order["content"]+"</td>"
            orders+="<td style=\"font-size: 12px;\">"+order["date"]+"</br>"+order["uid"]+"</td></tr>"
    
    return wsgi_util.render_template_2("tptef.html",ORDERS=orders,ROOM=room,USER=user)
