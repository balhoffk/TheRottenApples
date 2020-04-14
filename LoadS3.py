import pandas as pd
import boto3
from botocore.exceptions import ClientError
from config import awskey
from config import secret

class AwsS3Loader():
    def LoadFile(bucketname, file):
        s3 = boto3.client('s3',aws_access_key_id=awskey,aws_secret_access_key=secret)
        Object_Read=s3.get_object(Bucket=bucketname,Key=file)
        output_data= pd.read_csv(Object_Read['Body'])
        return output_data
