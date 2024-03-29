#!/bin/bash

cd updateFatalEncounters/.venv/lib/python3.9/site-packages
# Only include dependencies for pyairtable as boto3 is already installed on Lambda
zip -r ../../../../../lambda-deploy.zip certifi charset_normalizer idna pyairtable requests
cd ../../../../
zip -g ../lambda-deploy.zip lambda_function.py
cd ..

aws lambda update-function-code \
    --function-name update-fatal-encounters \
    --zip-file fileb://lambda-deploy.zip \
    --profile newsroom-aws \
    --region us-east-2