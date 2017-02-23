
/*
export KMS_REGION=us-east-1
export SECRET_VALUE=needs-to-be-encrypted
*/

var i = require('../src/index.js');
var event = {
  "resource": "/{proxy+}",
  "path": "/decrypt",
  "httpMethod": "GET",
  "headers": {
  },
  "requestContext": {
    "authorizer": {
      "refresh_token": "ffffffff-ffff-ffff-ffff-ffffffffffff",
      "principalId": "user|a1b2c3d4"
    }
  },
  "queryStringParameters": {},
  "body": {
  }
}
var context = {succeed: res => console.log(res)};
i.handler(event, context, function(err, data) {
  if (err)  console.log(err);
  console.log("successfully completed");
  console.log(JSON.stringify(data, null, 2));
});
