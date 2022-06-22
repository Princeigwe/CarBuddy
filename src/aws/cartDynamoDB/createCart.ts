import {ddb} from "../clients/dynamoDBClient";
import {DynamoDB} from "aws-sdk"

export function createCart (email: string) {
    const createCartParams: DynamoDB.DocumentClient.PutItemInput = {
        TableName: "Cart",
        Item: {
            "cartOwnerEmail": email,
            "items": [],
            "finalTotal": "0"
        }
    }

    ddb.putItem(createCartParams, function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
        console.log("Success", data);
        }
    });
}