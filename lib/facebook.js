var request = require('request')

function normalizeUserObj(fbUser) {
  return {
    userId: fbUser.id
  }
}

var facebook = {
  validateUser: function(fbId, fbTkn, callback) {
    request.get('https://graph.facebook.com/me?access_token=' + fbTkn,
      function(err, res, body) {
        if (err) {
          return callback(new Error("Generic Facbook Error"), null)
        }

        if (res.statusCode !== 200) {
          return callback(new Error("Invalid Token"), null)
        }

        var bodyJson = null
        try {
          bodyJson = JSON.parse(body)
        } catch(e) {
          return callback(new Error("Generic Facbook Error"), null)
        }

        if (bodyJson.id !== fbId) {
          return callback(new Error("Invalid Token"), null)
        }

        callback(null, normalizeUserObj(bodyJson))
      }
    )
  }
}

module.exports = facebook
