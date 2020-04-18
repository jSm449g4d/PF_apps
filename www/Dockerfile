
FROM python:3.8

# Init
ENV APP /var/www
WORKDIR $APP
COPY . .
RUN apt update -q;apt upgrade -yq

# Javascript
WORKDIR $APP/html/static
RUN apt install npm -yq
RUN npm install -g npm
RUN npm install --save jquery@3.4.1 popper.js@1.16.1 crypto-js react react-dom react-bootstrap bootstrap firebase && \
    npm @fortawesome/fontawesome-free font-awesome-animation
# Typescript
WORKDIR $APP/Typescript
RUN npm install --save-dev @types/jquery @types/popper.js @types/crypto-js @types/react @types/react-dom @types/react-bootstrap @types/bootstrap  @types/firebase && \
    npm install --save-dev typescript webpack webpack-cli webpack-glob-entry ts-loader source-map-loader style-loader css-loader copy-webpack-plugin
RUN npx webpack

# Python3
WORKDIR $APP/Flask
RUN apt install gcc python3-pip -yq
RUN pip3 install -U pip
RUN pip3 install -U -r requirements.txt

# Hosting
WORKDIR $APP
CMD bash -c "waitress-serve --host=0.0.0.0 --port=8080 wsgi:app"
