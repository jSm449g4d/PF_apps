###  CONVERT DEV+OPS TO OPS FOR ORVERLAP INTO ANOTHER HOSTING (Apache2.4 etc...) ###
# 1. bash mkops.sh
# 2. $ cd /var/
# 3. Plz copy&paste intowww.zip → /var/
# 4. $ 7z x www.zip
# 5. $ sudo rm -r /var/www.zip

echo "start"
sudo apt install p7zip-full
7z a www.zip www/html/
7z a www.zip www/Flask/
7z a www.zip www/static/
7z a www.zip www/templates/
7z a www.zip www/FirebaseAdmin_Key.json
7z a www.zip www/wsgi_h.py
7z a www.zip www/wsgi.py
