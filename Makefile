NODE_ENV ?= production

clean:
	rm -rf dist node_modules
.PHONY: clean 

dependencies:
	yarn install --no-audit
.PHONY: dependencies

build: clean dependencies
	node_modules/.bin/webpack --mode=${NODE_ENV}
.PHONY: build 

run: dependencies
	node_modules/.bin/webpack-dev-server
.PHONY: build 