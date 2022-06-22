import * as AWS from 'aws-sdk'

AWS.config.update({region: 'us-east-2'})

export const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'})
