include .env
export $(shell sed 's/=.*//' .env)

.PHONY: openapi
openapi: openapi_http openapi_typescript

.PHONY: openapi_http
openapi_http:
	@oapi-codegen -config ./oapi_codegen_config.yml \
		-package "main" "api/openapi/user.yml" > internal/user/openapi_gen.go
	@oapi-codegen -config ./oapi_codegen_config.yml \
		-package "port" "api/openapi/customer.yml" > internal/customer/port/openapi_gen.go
	@oapi-codegen -config ./oapi_codegen_config.yml \
		-package "port" "api/openapi/catalogue.yml" > internal/catalogue/port/openapi_gen.go
	@oapi-codegen -config ./oapi_codegen_config.yml \
		-package "port" "api/openapi/mobile.yml" > internal/mobile/port/openapi_gen.go

.PHONY: openapi_typescript
openapi_typescript:
	@docker run --rm --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/local" \
		openapitools/openapi-generator-cli:v6.0.1 generate \
		-i /local/api/openapi/user.yml \
		-g typescript-axios \
		-o /local/web/src/openapi/user
	@docker run --rm --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/local" \
		openapitools/openapi-generator-cli:v6.0.1 generate \
		-i /local/api/openapi/customer.yml \
		-g typescript-axios \
		-o /local/web/src/openapi/customer
	@docker run --rm --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/local" \
		openapitools/openapi-generator-cli:v6.0.1 generate \
		-i /local/api/openapi/catalogue.yml \
		-g typescript-axios \
		-o /local/web/src/openapi/catalogue

.PHONY: proto
proto:
	@protoc --plugin=grpc \
		--go_out=internal/common/client \
		--go-grpc_out=internal/common/client \
		--proto_path=api/protobuf mobile.proto

.PHONY: siege
siege:
	@siege --concurrent=3 --reps=5 --delay=0 $(url)
