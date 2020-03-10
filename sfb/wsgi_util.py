# coding: utf-8
import sys
import os
import flask
import json
from flask import  render_template_string
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def render_template_2(dir,**kwargs):
    html=""
    with open(os.path.join("./templates/",dir),"r",encoding="utf-8") as f:
        html=f.read()
        for kw,arg in kwargs.items():
            html=html.replace("{{"+kw+"}}",arg)
    return render_template_string(html)

#AP_setting_management
access_counter=0;status_table="";config_dict={}
cred = firebase_admin.credentials.Certificate("FirebaseAdmin_Key.json")
with open("config.json","r",encoding="utf-8") as fp:config_dict.update(json.load(fp))
firebase_admin.initialize_app(cred)
db = firestore.client()
def add_status_table(title="",data="",color="navy"):
    global status_table
    status_table+="<tr><td style=\"color:"+color+";\">"+title+"</td><td style=\"color:"+color+";\">"+data+"</td></tr>"
def Resource_Reload():
    add_status_table("Python",sys.version,color="#555000")
    add_status_table("Flask",flask.__version__,color="#555000")