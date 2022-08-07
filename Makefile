include .env
export $(shell sed 's/=.*//' .env)

.PHONY: openapi
openapi: openapi_http openapi_typescript

.PHONY: openapi_http
openapi_http:
	@oapi-codegen -config ./oapi_codegen_config.yml \
		-package "main" "api/openapi/user.yml" > internal/user/openapi_gen.go

.PHONY: openapi_typescript
openapi_typescript:
	@docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli:v6.0.1 generate \
		-i /local/api/openapi/user.yml \
		-g typescript-axios \
		-o /local/web/src/openapi/user