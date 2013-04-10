MOCHA_OPTS = --check-leaks
REPORTER = spec

test: test-unit

test-unit:
				@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS) ./tests/*.js

test-cov: lib-cov
	@SWARM_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@rm -fr lib-cov
	@open coverage.html

lib-cov:
	@jscoverage models lib-cov

clean:
	rm -f coverage.html
	rm -fr lib-cov

.PHONY: test test-unit