# FOR CLONE FRONTS TO ANOTHER HOSTING (Apache2.4 etc...)
# 1. bash frontcopy.sh
# 2. Plz copy&paste frontcopy.zip → /var/www/
# 3. $ cd /var/www
# 4. $ 7z x frontcopy.zip

echo "start"
sudo apt install p7zip-full
7z a frontcopy.zip ./www/html/
7z a frontcopy.zip ./www/static/
