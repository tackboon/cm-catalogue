#!/bin/bash
readonly version="$1"

services=("catalogue" "catalogue-file" "customer" "user" "web")

for service in ${services[@]}; do
  docker push "tackboon97/cm-catalogue-$service:$version"
done
