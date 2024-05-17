#!/bin/bash

# Replace with your S3 bucket name and the relative path to the PEM file
S3_BUCKET_NAME=elasticbeanstalk-ap-southeast-2-861339070773
S3_CERT_PATH=ap-southeast-2-bundle.pem
LOCAL_CERT_PATH=/var/app/current/ap-southeast-2-bundle.pem

# Download the PEM file from S3 to the specified local path
aws s3 cp s3://$S3_BUCKET_NAME/$S3_CERT_PATH $LOCAL_CERT_PATH
aws s3 cp s3://elasticbeanstalk-ap-southeast-2-861339070773/ap-southeast-2-bundle.pem