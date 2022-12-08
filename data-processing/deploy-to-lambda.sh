#!/bin/bash

cd updateFatalEncounters/.venv/lib/python3.9/site-packages
zip -r ../../../../../lambda-deploy.zip certifi charset_normalizer idna pyairtable requests
cd ../../../../
zip -g ../lambda-deploy.zip lambda_function.py
cd ..

aws lambda update-function-code \
    --function-name updateFatalEncounters \
    --zip-file fileb://lambda-deploy.zip \
    --profile newsroom-aws \
    --region us-west-1