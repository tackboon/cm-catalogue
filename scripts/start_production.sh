#!/bin/bash
export $(grep -v 's/=.*//' .production.env)

docker stack deploy --compose-file docker-compose.swarm.yml cm-catalogue
