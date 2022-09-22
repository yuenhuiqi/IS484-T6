import boto3


# Set up s3 resource object. 
# assume_role may not need to be called in production because the EC2 instance will already have an attached role. 
# TODO - If this is the case, the assume_role can be wrapped in a condition to only run in the dev environment.
sts_client = boto3.client("sts")

assumedRoleObject = sts_client.assume_role(
    RoleArn="arn:aws:iam::241398974060:role/AI_backend",
    RoleSessionName="AssumeRoleSession1")

credentials=assumedRoleObject['Credentials']

s3 = boto3.resource("s3",
    aws_access_key_id=credentials['AccessKeyId'],
    aws_secret_access_key=credentials['SecretAccessKey'],
    aws_session_token=credentials['SessionToken']
    )

bucket_name = "is484t6"