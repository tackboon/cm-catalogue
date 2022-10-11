#!/bin/bash
export $(grep -v 's/=.*//' .production.env)

readonly version="$1"

services=("catalogue" "catalogue-file" "customer" "user" "mobile")

for service in ${services[@]}; do
  docker build -t "tackboon97/cm-catalogue-$service:$version" "./internal" \
    -f "./docker/app-production/Dockerfile" \
    --build-arg "SERVICE=$service"
done

docker build -t "tackboon97/cm-catalogue-web:$version" "./web" \
  -f "./web/Dockerfile.production" \
  --build-arg "REACT_APP_BRAND_NAME=$REACT_APP_BRAND_NAME" \
  --build-arg "REACT_APP_API_HOST=$REACT_APP_API_HOST" \
  --build-arg "REACT_APP_UPLOADER_ENDPOINT=$REACT_APP_UPLOADER_ENDPOINT" \
  --build-arg "REACT_APP_FIREBASE_AUTH_DOMAIN=$REACT_APP_FIREBASE_AUTH_DOMAIN" \
  --build-arg "REACT_APP_FIREBASE_API_KEY=$REACT_APP_FIREBASE_API_KEY" \
  --build-arg "REACT_APP_FIREBASE_PROJECT_ID=$REACT_APP_FIREBASE_PROJECT_ID" \
  --build-arg "REACT_APP_FIREBASE_STORAGE_BUCKET=$REACT_APP_FIREBASE_STORAGE_BUCKET" \
  --build-arg "REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$REACT_APP_FIREBASE_MESSAGING_SENDER_ID" \
  --build-arg "REACT_APP_FIREBASE_APP_ID=$REACT_APP_FIREBASE_APP_ID" \
  --build-arg "REACT_APP_FIREBASE_MEASUREMENT_ID=$REACT_APP_FIREBASE_MEASUREMENT_ID"
