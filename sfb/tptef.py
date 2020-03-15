from werkzeug.utils import secure_filename
import os
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import auth
from google.cloud import firestore
import wsgi_util


def show(req):
    room = "room_main"
    user = "窓の民は名無し"
    uid = ""
    debug=""
    if req.method == 'POST' or req.method == "GET":
        if 'room' in req.form:
            room = "room_"+req.form['room'].translate(str.maketrans(
                "", "", "\"\'\\/<>%`?;"))
        if 'user' in req.form:
            user = req.form['user'].translate(str.maketrans(
                "", "", "\"\'\\/<>%`?;"))
        # access firestore
        doc_ref = wsgi_util.db.collection("tptef").document(room)
        doc_ref.set({}, merge=True)
        try:
            uid = auth.verify_id_token(
                secure_filename(req.form["fbtoken"]))["uid"]
            # Remark
            if 'content' in req.form and "remark" in req.form and secure_filename(req.form["remark"]) == "True":
                doc_ref.update({str(int(datetime.now(pytz.UTC).timestamp()*1000)): {
                    "user": user,
                    "uid": uid,
                    "content": req.form['content'].translate(str.maketrans("\"\'\\/<>%`?;", '””￥_〈〉％”？；')),
                    "date": datetime.now(pytz.UTC).strftime("%Y/%m/%d %H:%M:%S %f (UTC)")
                }})
            if "clear" in req.form and secure_filename(req.form["clear"]) == "True":
                for k, v in doc_ref.get().to_dict().items():
                    if v["uid"] == uid:
                        doc_ref.update({k: firestore.DELETE_FIELD})
            if "delete" in req.form:
                debug+="AAA"
                for k, _ in doc_ref.get().to_dict().items():
                    debug+="BBB"
                    
                    if k == secure_filename(req.form["delete"]):
                        debug+="CCC"
                        doc_ref.update({k: firestore.DELETE_FIELD})
        except:
            False
        # show thread
        orders = "<table class=\"table table-sm bg-light\"><thead><tr><th style=\"width:15%\"> user_name </th>" +\
            "<th>content</th><th style = \"width: 15%\" > timestamp/uid </th><th>ops</th></tr></thead><tbody>"
        for k, v in sorted(doc_ref.get().to_dict().items()):
            orders += "<tr><td>"+v["user"]+"</td>"
            orders += "<td>"+v["content"]+"</td>"
            orders += "<td style=\"font-size: 12px;\">" + \
                v["date"]+"</br>"+v["uid"] + "</td>"
            if v["uid"] == uid:
                orders += "<td>" + "<button name=\"delete\" \"value=\"" + \
                    k+"\">delete</button>"+"</td></tr>"
            else:
                orders += "<td>_</td></tr>"
        orders += "</tbody></table>"
    return wsgi_util.render_template_2("tptef.html", ORDERS=orders, ROOM=room[len("room_"):], USER=user,DEBUG=debug)
