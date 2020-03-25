
FROM python:3.7

#server initialize
ENV APP /web_app
WORKDIR $APP
COPY . .
RUN apt update -q;apt upgrade -yq

#typescript
WORKDIR $APP/static
RUN apt install -yq npm
RUN npm install -g npm
RUN npm install typescript -g
RUN npm install --save react react-dom && \
    npm install --save-dev @types/react @types/react-dom && \
    npm install --save-dev typescript ts-loader source-map-loader && \
    npm install --save-dev webpack webpack-cli && \
RUN npx webpack

#pip
WORKDIR $APP
RUN apt install -yq pip gcc
RUN pip install -U pip
RUN pip install -U flask waitress janome werkzeug psutil urllib3 certifi pytz neologdn \
firebase-admin google-cloud-firestore google-cloud-storage BeautifulSoup4 requests urllib3 \
SQLAlchemy mysqlclient

#server hosting
WORKDIR $APP
CMD bash -c "waitress-serve --host=0.0.0.0 --port=8080 wsgi:app"
