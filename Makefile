NODE_ENV ?= production

clean:
	rm -rf dist node_modules
.PHONY: clean 

dependencies:
	yarn
.PHONY: dependencies

build: clean dependencies
	yarn run webpack --mode=${NODE_ENV}
.PHONY: build 

run: dependencies
	yarn run webpack-dev-server
.PHONY: build 