var MockRequest = function (body, session) {
  body = body || {};
  session = session || {};

  return {
    body: body,
    session: session
  };
};

module.exports = MockRequest;