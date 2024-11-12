#!/bin/bash

mkdir package
pipenv requirements | pipenv run pip install -r /dev/stdin --target ./package
cp lambda_function.py ./package
cd package
zip -r ../package.zip .
cd ..
aws lambda update-function-code \
    --profile newsroom-aws \
    --function-name update-fatal-encounters \
    --zip-file fileb://package.zip \
    --region us-east-2
rm -r package
rm package.zip