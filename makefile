test:
	@NODE_ENV=test mocha

test-debug:
	@NODE_ENV=test mocha

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--growl \
		--watch

.PHONY: test test-w