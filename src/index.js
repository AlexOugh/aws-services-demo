
var baseHandler = require('./base_handler.js')
var AWS = require('aws-sdk');

exports.handler = (event, context) => {
  baseHandler.handler(event, context);
}

baseHandler.post = function(params) {

  var kmsRegion = process.env.BUCKET_REGION;
  var redshiftConnectionString = process.env.REDSHIFT_CONNECTION_STRING;
  var redshiftUser = process.env.REDSHIFT_USER;
  var redshiftPass = process.env.REDSHIFT_PASS;

  var kms = new AWS.KMS({region: kmsRegion});
  var params = {
    CiphertextBlob: new Buffer(redshiftPass, 'base64')
  };
  return kms.decrypt(params).then(function(data) {
    redshiftPass = data.Plaintext.toString();
    redshiftConnectionString = 'pg:' + redshiftUser + ':' + redshiftPass + '@' + redshiftConnectionString;
  }).then(function() {
    // now run the sql in the redshift
    var connection = pgp(redshiftConnectionString);
    return connection.query(params.sql).then(function(result) {
      console.log(result);
      pgp.end();
      return result;
    });
  });
}
