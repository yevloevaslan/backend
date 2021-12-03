#!/bin/bash

# example
# sh dump.sh translate

#CRON:
# PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
# 0 0 * * * /bin/sh /root/translator/dump.sh >> /root/dump/mongodump.log 2>&1

db=$1
today=$(date  +%m%d%Y)
echo ${today}
dumpdir=${PWD}/dump/
daydumpdir=${dumpdir}"${today}"
mkdir -p ${PWD}/dump/

CONTAINER_NAME=$(docker ps -qf "name=mongo")


echo "docker exec ${CONTAINER_NAME} mongodump  --gzip --db=${db}"
docker exec ${CONTAINER_NAME} mongodump  --gzip --db=${db}


echo "docker cp ${CONTAINER_NAME}:/dump/${db} ${daydumpdir}"
docker cp ${CONTAINER_NAME}:/dump/${db} ${daydumpdir}


echo "docker exec ${CONTAINER_NAME} rm -rf dump/${db}"
docker exec ${CONTAINER_NAME} rm -rf dump/${db}

echo "find ${dumpdir}. -type d -mtime +7 -exec rm -rf {} \;"
find ${dumpdir}. -type d -mtime +7 -exec rm -rf {} \;