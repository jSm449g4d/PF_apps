from werkzeug.utils import secure_filename
import os
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import auth
from firebase_admin import firestore
import wsgi_util
from flask import send_file

os.makedirs("wsgi_temp", exist_ok=True)
tempfile = os.path.join(wsgi_util.config_dict["temp_folder"], "attachment.tmp")


def show(req):
    room = "room_main"
    user = "窓の民は名無し"
    uid = ""
    if req.method == 'POST':
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
            doc_ref.update({remark_key: {
                "user": "user",
                "uid": "uid",
                "content": "CONTENT",
                "date": datetime.now(pytz.UTC).strftime("%Y/%m/%d %H:%M:%S %f (UTC)"),
                "attachment": "",
            }})
            # Remark
            if 'content' in req.form and "remark" in req.form and secure_filename(req.form["remark"]) == "True":
                attachment = ""
                if 'attachment' in req.files:
                    req.files['attachment'].save(tempfile)
                    wsgi_util.GCS_bucket.blob(os.path.join(
                        "tptef", room, remark_key)).upload_from_filename(tempfile)
                    attachment = secure_filename(
                        req.files['attachment'].filename)
                doc_ref.update({remark_key: {
                    "user": user,
                    "uid": uid,
                    "content": req.form['content'].translate(str.maketrans("\"\'\\/<>%`?;", '””￥_〈〉％”？；')),
                    "date": datetime.now(pytz.UTC).strftime("%Y/%m/%d %H:%M:%S %f (UTC)"),
                    "attachment": "_"+attachment,
                }})
            if "delete" in req.form:
                wsgi_util.GCS_bucket.blob(os.path.join(
                    "tptef", room, secure_filename(req.form["delete"]))).delete()
                doc_ref.update(
                    {secure_filename(req.form["delete"]): firestore.DELETE_FIELD})
        except:
            False
        # download_attachment
        if "download" in req.form:
            wsgi_util.GCS_bucket.blob(os.path.join(
                "tptef", room, secure_filename(req.form["download"]))).download_to_filename(tempfile)
            return send_file(tempfile, as_attachment=True)
        # show thread
        orders = "<table class=\"table table-sm bg-light\"><thead><tr><th style=\"width:15%\"> user_name </th>" +\
            "<th>content</th><th style = \"width: 15%\" > timestamp/uid </th><th style=\"width:15%\">ops</th></tr></thead><tbody>"
        for k, v in sorted(doc_ref.get().to_dict().items()):
            orders += "<tr><td>"+v["user"]+"</td><td>"+v["content"]+"</td>"
            orders += "<td style=\"font-size: 12px;\">" + \
                v["date"]+"</br>"+v["uid"] + "</td><td>"
            if v["attachment"] != "_":
                orders += "<button name=\"download\" value=\"" + \
                    k+"\">"+v["attachment"].lstrip("_")+"</button><br/>"
            if v["uid"] == uid:
                orders += "<button name=\"delete\" value=\"" + k+"\">delete</button>"
            orders += "</td></tr>"
        orders += "</tbody></table>"
        # clear_tempfile
        if os.path.exists(tempfile):
            os.remove(tempfile)
        return wsgi_util.render_template_2("tptef.html", ORDERS=orders, ROOM=room[len("room_"):], USER=user)
    return "<h5>Plz access by POST</h5>"
