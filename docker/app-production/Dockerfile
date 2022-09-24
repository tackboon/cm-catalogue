########################################
# Build environment
########################################
FROM golang:1.19.1-alpine3.16 AS builder
ARG SERVICE
RUN mkdir /internal
COPY . /internal
WORKDIR /internal/$SERVICE
RUN go build -o /app .

########################################
# Execution environment
########################################
FROM alpine:3.16
COPY --from=builder /app /app
CMD ["/app"]