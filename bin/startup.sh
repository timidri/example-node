#!/usr/bin/env bash

if [ -z "{{AWS_ACCESS_KEY_ID}}" ]; then
   echo "AWS_ACCESS_KEY_ID is empty"
fi

if [ -z "{{AWS_SECRET_ACCESS_KEY}}" ]; then
   echo "AWS_SECRET_ACCESS_KEY is empty"
fi

if [ -z "{{&S3_CONFIG_BUCKET}}" ]; then
   echo "S3_CONFIG_BUCKET is empty"
fi

echo '{{&S3_CONFIG_BUCKET}}'

aws s3 sync {{&S3_CONFIG_BUCKET}} /data/apps/prod/module-service/conf
ls /data/apps/prod/module-service/conf
npm start

