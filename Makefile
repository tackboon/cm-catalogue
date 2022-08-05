include .env
export $(shell sed 's/=.*//' .env)

