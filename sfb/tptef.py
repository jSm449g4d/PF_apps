from werkzeug.utils import secure_filename
import os
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import auth
from firebase_admin import firestore
import wsgi_util

os.makedirs("wsgi_temp", exist_ok=True)


def show(req):
    room = "room_main"
    user = "窓の民は名無し"
    uid = ""
    debug = ""
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
            remark_key = str(int(datetime.now(pytz.UTC).timestamp()*1000))
            # Remark
            if 'content' in req.form and "remark" in req.form and secure_filename(req.form["remark"]) == "True":
                doc_ref.update({remark_key: {
                    "user": user,
                    "uid": uid,
                    "content": req.form['content'].translate(str.maketrans("\"\'\\/<>%`?;", '””￥_〈〉％”？；')),
                    "date": datetime.now(pytz.UTC).strftime("%Y/%m/%d %H:%M:%S %f (UTC)"),
                    "attachment": "",
                }})
            if "delete" in req.form:
                doc_ref.update(
                    {secure_filename(req.form["delete"]): firestore.DELETE_FIELD})
#                for k, _ in doc_ref.get().to_dict().items():
#                    if k == secure_filename(req.form["delete"]):
#                        doc_ref.update({k: firestore.DELETE_FIELD})
            if 'attachment' in req.files:
                tempfile = os.path.join(
                    wsgi_util.config_dict["temp_folder"], "attachment.tmp")
                req.files['attachment'].save(tempfile)
                wsgi_util.GCS_bucket.blob(os.path.join(
                    "tptef", room, remark_key)).upload_from_filename(tempfile)
                os.remove(tempfile)
                doc_ref.update({remark_key: {
                    "attachment": remark_key+secure_filename(req.files['attachment'].filename),
                }})
        except:
            False
        # show thread
        orders = "<table class=\"table table-sm bg-light\"><thead><tr><th style=\"width:15%\"> user_name </th>" +\
            "<th>content</th><th style = \"width: 15%\" > timestamp/uid </th><th style=\"width:15%\">ops</th></tr></thead><tbody>"
        for k, v in sorted(doc_ref.get().to_dict().items()):
            orders += "<tr><td>"+v["user"]+"</td>"
            orders += "<td>"+v["content"]+"</td>"
            orders += "<td style=\"font-size: 12px;\">" + \
                v["date"]+"</br>"+v["uid"] + "</td><td>"
            if v["attachment"] != "":
                orders += "<button name=\"download\" value=\"" + \
                    k+"\">"+v["attachment"]+"</button><br/>"
            if v["uid"] == uid:
                orders += "<button name=\"delete\" value=\"" + \
                    k+"\">delete</button>"
            orders += "</td></tr>"
        orders += "</tbody></table>"
    return wsgi_util.render_template_2("tptef.html", ORDERS=orders, ROOM=room[len("room_"):], USER=user, DEBUG=debug)
