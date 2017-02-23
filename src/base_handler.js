
'use strict';

exports.handler = (event, context) => {

  console.log('Received event:', JSON.stringify(event, null, 2));

  var method = event.httpMethod.toLowerCase();
  var paths = event.path.split('/');
  var path = paths[paths.length-1];
  var queryParams = event.queryStringParameters;
  if (queryParams == null)  queryParams = {};
  var postData = (event.body) ? event.body : {};
  if (postData && typeof(postData) == "string") postData = JSON.parse(postData);
  var authorizer = (event.requestContext) ? event.requestContext.authorizer: null;

  var credentials = null;
  if (event.headers.Credentials) {
    credentials = JSON.parse(new Buffer(event.headers.Credentials, 'base64').toString())
  }
  console.log(credentials);

  try {
    var params = postData;
    if (method == 'get') params = queryParams;
    params['Credentials'] = credentials;
    this[method](params, function(err, data) {
      if (err) {
        console.log(err);
        sendFailureResponse({error: err}, 200, context, authorizer);
      }
      else {
        console.log(data);
        sendSuccessResponse(data, context, authorizer);
      }
    });
  }
  catch(err) {
    console.log(err);
    sendNotPermittedMethodResponse(event.path, event.httpMethod, context, authorizer);
  }
}

function sendNotPermittedMethodResponse(path, method, context, authorizer) {
  var responseBody = {error: "not permitted method " + method + " in " + path};
  var statusCode = 404;
  sendResponse(responseBody, statusCode, context, authorizer);
}

function sendNotFoundResponse(path, method, context, authorizer) {
  var responseBody = {error: "invalid path " + path};
  var statusCode = 404;
  sendResponse(responseBody, statusCode, context, authorizer);
}

function sendSuccessResponse(retValue, context, authorizer) {
  var responseBody = retValue;
  var statusCode = 200;
  sendResponse(responseBody, statusCode, context, authorizer);
}

function sendFailureResponse(err, statusCode, context, authorizer) {
  var responseBody = err;
  sendResponse(responseBody, statusCode, context, authorizer);
}

function sendResponse(responseBody, statusCode, context, authorizer) {
  if (authorizer) responseBody['__authorizer'] = authorizer
  var response = {
      statusCode: statusCode,
  };
  response['headers'] = { "Access-Control-Allow-Origin": "*" };
  response['body'] = JSON.stringify(responseBody);
  console.log("response: " + JSON.stringify(response))
  context.succeed(response);
}
