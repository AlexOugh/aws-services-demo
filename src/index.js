
var baseHandler = require('./base_handler.js')

exports.handler = (event, context) => {
  baseHandler.handler(event, context);
}

post: function(params) {

  let kmsRegion = process.env.BUCKET_REGION;
  let redshiftConnectionString = process.env.REDSHIFT_CONNECTION_STRING;
  let redshiftUser = process.env.REDSHIFT_USER;
  let redshiftPass = process.env.REDSHIFT_PASS;

  var input = {
    region: kmsRegion,
    password: redshiftPass
  };
  return kms.decrypt(input).then(function(data) {
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
