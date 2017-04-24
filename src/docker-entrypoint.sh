#!/bin/sh
cd /app
npm uninstall sqlite3
npm install sqlite3
cd /app/bin
if [ "$1" ]
then
    PORT=$1 node ./www
else
    PORT=51360 node ./www
fi
