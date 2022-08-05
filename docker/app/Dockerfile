FROM golang:1.18.3

RUN go install github.com/cosmtrek/air@latest
COPY .air.toml /

ENTRYPOINT ["air", "-c", "/.air.toml"]