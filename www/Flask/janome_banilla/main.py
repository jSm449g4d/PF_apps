# server
import flask
import os
import sys
# application
from janome.tokenizer import Tokenizer
from werkzeug.utils import secure_filename


# server
def render_template_FaaS(dir, **kwargs):
    try:
        with open(os.path.join(dir), "r", encoding="utf-8") as f:
            html = f.read()
            for kw, arg in kwargs.items():
                html = html.replace("{{"+kw+"}}", arg)
            return flask.render_template_string(html)
    except:
        return "error:loading main.html"


# application
t = Tokenizer()


def show(request):
    global t
    ret = ""

    if 'warmup' in request.args:
        if secure_filename(request.args['warmup']) == "True":
            return ""

    if request.method == "POST":
        if 'speech' in request.json:
            target = request.json['speech'].translate(
                str.maketrans("\"\'\\/<>%`?;", '””￥_〈〉％”？；'))
            target = target.translate(str.maketrans("", "", ", "))
            for token in t.tokenize(target):
                ret += token.part_of_speech.split(',')[0]+","
            return ret.strip(',')

        # under constructhion
        if 'speech2' in request.json:
            target = request.json['speech2'].translate(
                str.maketrans("\"\'\\/<>%`?;", '””￥_〈〉％”？；'))
            target = target.translate(str.maketrans("", "", ", "))
            for token in t.tokenize(target):
                ret += token.part_of_speech.split(',')[1]+","
            return ret.strip(',')

        if 'surface' in request.json:
            target = request.json['surface'].translate(
                str.maketrans("\"\'\\/<>%`?;", '””￥_〈〉％”？；'))
            target = target.translate(str.maketrans("", "", ", "))
            for token in t.tokenize(target, wakati=True):
                ret += token+","
            return ret.strip(',')

        if 'phonetic' in request.json:
            target = request.json['phonetic'].translate(
                str.maketrans("\"\'\\/<>%`?;", '””￥_〈〉％”？；'))
            target = target.translate(str.maketrans("", "", ", "))
            for token in t.tokenize(target):
                ret += token.phonetic+","
            return ret.strip(',')

    return render_template_FaaS(os.path.join(os.path.dirname(__file__), "main.html"))
