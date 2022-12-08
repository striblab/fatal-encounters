import json
import os
from pyairtable import Table
import boto3
from botocore.exceptions import ClientError


api_key = os.environ['AIRTABLE_API_KEY']
base_id = os.environ['AIRTABLE_BASE_ID']
table_id = os.environ['AIRTABLE_TABLE_ID']
access_key_id = os.environ["aws_access_key_id"]
access_key = os.environ["aws_secret_access_key"]

def lambda_handler(event, context):

    table = Table(
        api_key,
        base_id,
        table_id
    )

    data = []

    rows = table.all()
    for r in rows:
        data.append(r["fields"])

    payload = {"mn_shootings": data}

    s3 = boto3.resource(
        "s3",
        aws_access_key_id=access_key_id,
        aws_secret_access_key=access_key
    )
    s3object = s3.Object("static.startribune.com", 'news/projects/all/strib-fatal-encounters-db/data/data.json')

    try:
        s3object.put(
            Body=(bytes(json.dumps(payload).encode('UTF-8'))),
            ContentDisposition="inline",
            ContentType="application/json"
        )
    except ClientError as e:
        return {
            "statusCode": 500,
            "body": json.dumps(str(e))
        }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps('Successfully pushed update to Fatal Encounters data.')
    }