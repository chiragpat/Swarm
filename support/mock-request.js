'use strict';

var MockRequest = function (body, session, params) {
  body = body || {};
  session = session || {};
  params = params || {};

  return {
    body: body,
    session: session,
    params: params
  };
};

module.exports = MockRequest;
