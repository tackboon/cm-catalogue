FROM golang:1.19.1-alpine3.16

RUN go install github.com/cosmtrek/air@latest
COPY .air.toml /

ENTRYPOINT ["air", "-c", "/.air.toml"]