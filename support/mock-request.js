var MockRequest = function (body, session) {
  if (!body) {
    body = {};
  }
  if (!session) {
    session = {};
  }

  return {
    body: body,
    session: session
  };
};

module.exports = MockRequest;