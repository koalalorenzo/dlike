NODE_ENV ?= production

clean:
	rm -rf dist public node_modules
.PHONY: clean 

node_modules:
	yarn install --no-audit

build: node_modules
	node_modules/.bin/webpack --mode=${NODE_ENV}
.PHONY: build 

run: node_modules
	node_modules/.bin/webpack-dev-server
.PHONY: build 