function doFbLogin() {
  window.parent.location = 'https://graph.facebook.com/oauth/authorize?client_id=' + FB_APP_ID + '&redirect_uri=' + window.location
}

function handleFbLogin(userId, accessToken) {
  $.post("/signin-facebook", { fbId: userId, fbToken: accessToken }, function (data) {
    if (data.error) {
      alert(data.error)
    } else {
      var host = window.location.host
      console.log(host + data.redirect)
      window.location = "http://" + host + data.redirect
    }
  }, "json")
}

function doLogin() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      handleFbLogin(response.authResponse.userID, response.authResponse.accessToken)
    } else if (response.status === 'not_authorized') {
      doFbLogin();
    } else {
      doFbLogin();
    }
  }, true)
}

$(document).ready(function() {
  $.getScript('//connect.facebook.net/en_US/all.js', function(){
    FB.init({
      appId: FB_APP_ID,
      cookie: true
    })
  })

  $("#login-button").on("click", doLogin)
})
