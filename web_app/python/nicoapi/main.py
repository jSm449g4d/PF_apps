import flask
import os
import sys

def render_template_FaaS(dir, **kwargs):
    html = ""
    with open(os.path.join(dir), "r", encoding="utf-8") as f:
        html = f.read()
        for kw, arg in kwargs.items():
            html = html.replace("{{"+kw+"}}", arg)
    return flask.render_template_string(html)

def show(request):
    return render_template_FaaS(os.path.join(os.path.dirname(__file__),"main.html"))
