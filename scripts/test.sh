#!/bin/bash
export $(grep -v 's/=.*//' .test.env)

readonly service="$1"

cd "./internal/$service"
go test -v -count=1 -coverprofile="$service"_cover ./...
go tool cover -html="$service"_cover -o "$service"_cover.html
