PG = ( typeof PG == 'undefined' ? {} : PG );
PG.FB = {
  init: function(apiKey, fail) {
    // create the fb-root element if it doesn't exist
    if (!document.getElementById('fb-root')) {
      var elem = document.createElement('div');
      elem.id = 'fb-root';
      document.body.appendChild(elem);
    }
    Cordova.exec(function() {
      var authResponse = JSON.parse(localStorage.getItem('pg_fb_session') || '{"expiresIn":0}');
      if (authResponse && authResponse.expirationTime) {
        var nowTime = (new Date()).getTime();
        if (authResponse.expirationTime > nowTime) {
          FB.Auth.setAuthResponse(authResponse, 'connected');
        }
      }
      console.log('Cordova Facebook Connect plugin initialized successfully.');
    }, (fail?fail:null), 'com.phonegap.facebook.Connect', 'init', [apiKey]);
  },
  login: function(params, cb, fail) {
    params = params || { scope: '' };
    Cordova.exec(function(e) { // login
      var oldSdk = typeof e.session !== 'undefined',
          response = oldSdk ? e.session : e.authResponse,
          userId = oldSdk ? response.uid : response.userID,
          accessToken = oldSdk ? response.access_token : response.accessToken,
          expiresIn = oldSdk ? response.expires : response.expiresIn;

        if (expiresIn) {
          var expirationTime = expiresIn === 0 ? 0 : (new Date()).getTime() + expiresIn * 1000;
          response.expirationTime = expirationTime;
        }
        localStorage.setItem('pg_fb_session', JSON.stringify(response));
        FB.Auth.setAuthResponse(response, 'connected');
        if (cb) cb(e);
    }, (fail?fail:null), 'com.phonegap.facebook.Connect', 'login', params.scope.split(',') );
  },
  logout: function(cb, fail) {
    Cordova.exec(function(e) {
      localStorage.removeItem('pg_fb_session');
      FB.Auth.setAuthResponse(null, 'notConnected');
      if (cb) cb(e);
    }, (fail?fail:null), 'com.phonegap.facebook.Connect', 'logout', []);
  },
  getLoginStatus: function(cb, fail) {
    Cordova.exec(function(e) {
      if (cb) cb(e);
    }, (fail?fail:null), 'com.phonegap.facebook.Connect', 'getLoginStatus', []);
  },
  dialog: function(params, cb, fail) {
    Cordova.exec(function(e) { // login
      if (cb) cb(e);
                  }, (fail?fail:null), 'com.phonegap.facebook.Connect', 'showDialog', [params] );
  }
};
