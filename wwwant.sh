# FOR ORVERLAP FRONT+BACK TO ANOTHER HOSTING (Apache2.4 etc...)
# 1. bash intowww.sh
# 2. Plz copy&paste intowww.zip → /var/www/
# 3. $ cd /var/www
# 4. $ 7z x intowww.zip
# 5. $ sudo rm -r /var/www/intowww.zip

echo "start"
sudo apt install p7zip-full
7z a intowww.zip ./www/html/
7z a intowww.zip ./www/Python3/
7z a intowww.zip ./www/static/
7z a intowww.zip ./www/templates/
7z a intowww.zip ./www/config.json
7z a intowww.zip ./www/FirebaseAdmin_Key.json
7z a intowww.zip ./www/requirements.txt
7z a intowww.zip ./www/wsgi_util.py
7z a intowww.zip ./www/wsgi.py
