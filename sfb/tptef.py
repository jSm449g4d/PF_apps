from flask import  render_template_string,send_file
from werkzeug.utils import secure_filename
import os
import hashlib
from datetime import datetime
import pytz
from firebase_admin import auth
from firebase_admin import firestore
import wsgi_util


def show(req):
    
    room=""
    user=""
    content=""
    passwd=""
    fbtoken=""
    orders=""
    if req.method == 'POST':
        if "fbtoken" in req.form:fbtoken=secure_filename(req.form["fbtoken"])#Firebase_Token_keep
        if 'room' in req.form:
            room=req.form['room'].translate(str.maketrans("","","\"\'\\/<>%`?;"))#Not_secure_filename!
        if 'user' in req.form:
            user=req.form['user'].translate(str.maketrans("","","\"\'\\/<>%`?;"))#Not_secure_filename!
        if 'content' in req.form:
            content=req.form['content'].translate(str.maketrans("\"\'\\/<>%`?;",'””￥_〈〉％”？；'))#Not_secure_filename!
        if 'pass' in req.form:
            passwd=secure_filename(req.form['pass'])
        
        if room=="":room="main_page"
        
        doc_ref = wsgi_util.db.collection("tptef").document(room);
        if "remark" in req.form and secure_filename(req.form["remark"])=="True":
            doc_ref.set({str(datetime.now(pytz.UTC).timestamp()).split(".")[0]+"PS1":{
                "user":user,
                "content": content,
                "trip":hashlib.sha256(passwd.encode('utf-8')).hexdigest(),
                "date":datetime.now(pytz.UTC).strftime("%Y/%m/%d %H:%M:%S %f (UTC)")
            }})
            
        if "clear" in req.form and secure_filename(req.form["clear"])=="True":
            doc_ref.where("trip", "==", hashlib.sha256(passwd.encode('utf-8')).hexdigest()).delete()
    #show chat thread
        orders=doc_ref.get().to_dict()
        
#        for order in orders:
#            1
#            orders+="<tr><td>"+order.to_dict()["user"]+"</td>"
#            orders+="<td>"+order.to_dict()["content"]+"</td>"
#            orders+="<td style=\"font-size: 12px;\">"+(order.to_dict()["trip"])[:16]+"<br>"+(order.to_dict()["trip"])[16:32]+\
#            "<br>"+(order.to_dict()["trip"])[32:48]+"<br>"+(order.to_dict()["trip"])[48:64]+"</td>"
#            orders+="<td style=\"font-size: 12px;\">"+order.to_dict()["date"]+"</td></tr>"
    
    
    return wsgi_util.render_template_2("tptef.html",ORDERS=orders,ROOM=room,USER=user,PASS=passwd)
