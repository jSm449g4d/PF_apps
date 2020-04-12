# Standard
import os
import sys
import json
# Additional
import flask
from janome.tokenizer import Tokenizer


# FaaS Standard
def render_template_FaaS(dir: str, **kwargs):
    try:
        with open(os.path.join(dir), "r", encoding="utf-8") as f:
            html = f.read()
            for kw, arg in kwargs.items():
                html = html.replace("{{"+kw+"}}", arg)
            return flask.render_template_string(html)
    except:
        return "error: loading main.html"


# application
t = Tokenizer()


def show(request):
    ret = {}
    global t
    if request.method == "POST":
        # warmup
        if "warmup" in request.json.keys():
            return "warmup!"
        # wakati {wakati: text}
        if "wakati" in request.json.keys():
            ret["wakati"] = []
            for token in t.tokenize(request.json["wakati"].translate(str.maketrans("\"\'\\/<>%`?;", '””￥_〈〉％”？；', ", ")), wakati=True):
                ret["wakati"].append(token)
            return json.dumps(ret, ensure_ascii=False)
        # default {mode: tasks, content: text}
        if ("mode" in request.json.keys()) and ("content" in request.json.keys()):
            for key in request.json["mode"]:
                ret[key] = []
            for token in t.tokenize(request.json["content"].translate(str.maketrans("\"\'\\/<>%`?;", '””￥_〈〉％”？；', ", "))):
                if "surface" in request.json["mode"]:
                    ret["surface"].append(token.surface)
                if "speech" in request.json["mode"]:
                    ret["speech"].append(token.part_of_speech.split(",")[0])
                if "phonetic" in request.json["mode"]:
                    ret["phonetic"].append(token.phonetic)
            return json.dumps(ret, ensure_ascii=False)

    return render_template_FaaS(os.path.join(os.path.dirname(__file__), "main.html"))
