
var baseHandler = require('./base_handler.js')
var AWS = require('aws-sdk');

exports.handler = (event, context) => {
  baseHandler.handler(event, context);
}

baseHandler.get = function(params, callback) {

  var kmsRegion = process.env.KMS_REGION;
  var secretValue = process.env.SECRET_VALUE;

  var kms = new AWS.KMS({region: kmsRegion});
  var params = {
    CiphertextBlob: new Buffer(secretValue, 'base64')
  };
  kms.decrypt(params).promise().then(function(data) {
    console.log(data);
    return callback(null, data);
  }).catch(function(err) {
    return callback(err);
  });
}
