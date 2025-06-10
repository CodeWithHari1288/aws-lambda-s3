import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async () => {

   const client = new DynamoDBClient({region:"us-east-1"});
   const docClient = DynamoDBDocumentClient.from(client);
   console.log("INSERTING IN ................."); 

//    const command = new PutCommand({
//     TableName: "DummyTable",
//     Item: {
//       id: Math.random().toString(32),
//       s3inserted: "S3 Bucket Inserted/Updated",
//     },
//   });

//   console.log(command);
  await docClient.send(new PutCommand({
    TableName: 's3putstreeam',
    Item: {
      id: Math.random().toString(32),
      action: "Added a new folder in S3"
    },
  })).then(data=>{
    console.log(data )
  }).catch(e=>{
    console.log("exception ........" + e)
  });

}
