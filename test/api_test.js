var helper = require("./test_helper")
var assert = require("assert")
var request = require("request")

describe("API", function(){
  it("request '/'", function(done){
    request(helper.host, function(err, resp, body) {
      assert.equal(resp.statusCode, 200)
      done()
    })
  })
})
