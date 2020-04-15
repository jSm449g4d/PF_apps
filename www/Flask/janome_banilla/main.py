# Standard
import os
import sys
import json
# Additional
import flask
from janome.tokenizer import Tokenizer


# global variable
access_counter = 0
t = Tokenizer()


def show(request):
    # head ← (template)
    global access_counter
    access_counter += 1
    status_dict: dict = {"access_counter": str(access_counter)}

    # body
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

    # foot ← (template)
    status_lines: str = "<h6 class='text-center'>==STATUS==</h6>"
    for key, value in status_dict.items():
        status_lines += "<div class='text-center' >" + key+": "+value+"</div>"
    kwargs = {"STATUS_LINES": status_lines}
    with open(os.path.join(os.path.dirname(__file__), "main.html"), "r", encoding="utf-8") as f:
        html = f.read()
        for kw, arg in kwargs.items():
            html = html.replace("{{"+kw+"}}", arg)
        return flask.render_template_string(html)
    return "404: nof found → main.html", 404
