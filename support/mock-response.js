var MockResponse = function(cb){
  if (!cb) {
     throw new Error('No callback to mock response');
  }
  return {
    status: null,
    headers: {},
    body: "",
    redirect_path: "",

    writeHead: function(status, headers) {
      this.status = status;
      this.headers = headers;
    },

    write: function(body) {
      this.body += body;
    },

    end: function() {
      if (this.headers['Content-Type'] === 'application/json') {
        this.body = JSON.parse(this.body);
      }
      cb(this);
    },

    redirect: function(path) {
      this.redirect_path = path;
      cb(this);
    }
  };
};

module.exports = MockResponse;